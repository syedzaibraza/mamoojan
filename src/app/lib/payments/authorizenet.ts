type AuthorizeNetEnvironment = "sandbox" | "production";

type OpaqueData = {
  dataDescriptor: string;
  dataValue: string;
};

type ChargeCardTokenInput = {
  amount: string;
  opaqueData: OpaqueData;
  invoiceNumber?: string;
  customerEmail?: string;
  orderDescription?: string;
};

type ChargeCardTokenResult = {
  approved: boolean;
  transactionId?: string;
  responseCode?: string;
  authCode?: string;
  avsResultCode?: string;
  cvvResultCode?: string;
  rawMessage: string;
};

type AuthorizeNetApiResponse = {
  transactionResponse?: {
    responseCode?: string;
    authCode?: string;
    avsResultCode?: string;
    cvvResultCode?: string;
    transId?: string;
    errors?: Array<{ errorCode?: string; errorText?: string }>;
    messages?: Array<{ code?: string; description?: string }>;
  };
  messages?: {
    resultCode?: "Ok" | "Error";
    message?: Array<{ code?: string; text?: string }>;
  };
};

function firstDefined(...values: Array<string | undefined>) {
  for (const v of values) {
    if (typeof v === "string" && v.trim().length > 0) return v;
  }
  return undefined;
}

function getAuthorizeNetEnvironment(): AuthorizeNetEnvironment {
  const value = firstDefined(
    process.env.NEXT_PUBLIC_AUTHNET_ENV,
    process.env.NEXT_PUBLIC_AUTHORIZE_NET_ENV,
    process.env.AUTHNET_ENV,
    process.env.AUTHORIZE_NET_ENV,
    "sandbox",
  );
  return value?.toLowerCase() === "production" ? "production" : "sandbox";
}

function getAuthorizeNetEndpoint(): string {
  const env = getAuthorizeNetEnvironment();
  return env === "production"
    ? "https://api2.authorize.net/xml/v1/request.api"
    : "https://apitest.authorize.net/xml/v1/request.api";
}

function formatMoney(amount: number): string {
  return amount.toFixed(2);
}

function assertAuthorizeNetEnv() {
  const apiLoginId = firstDefined(
    process.env.AUTHNET_API_LOGIN_ID,
    process.env.AUTHORIZE_NET_API_LOGIN_ID,
  );
  const transactionKey = firstDefined(
    process.env.AUTHNET_TRANSACTION_KEY,
    process.env.AUTHORIZE_NET_TRANSACTION_KEY,
  );
  if (!apiLoginId || !transactionKey) {
    throw new Error(
      "Missing Authorize.net configuration. Provide either (AUTHORIZE_NET_API_LOGIN_ID/AUTHORIZE_NET_TRANSACTION_KEY) or (AUTHNET_API_LOGIN_ID/AUTHNET_TRANSACTION_KEY).",
    );
  }

  // Authorize.net API Login ID max length is 25 chars.
  if (apiLoginId.length > 25) {
    throw new Error(
      "Invalid Authorize.net API Login ID. It must be the real Authorize.net login id (max 25 chars), not a pk_/sk_ key from another provider.",
    );
  }

  // Most Authorize.net transaction keys are 16 chars; enforce a sensible range.
  if (transactionKey.length < 8 || transactionKey.length > 64) {
    throw new Error("Invalid Authorize.net Transaction Key format.");
  }

  return { apiLoginId, transactionKey };
}

function pickBestMessage(payload: AuthorizeNetApiResponse): string {
  const txError = payload.transactionResponse?.errors?.[0]?.errorText;
  if (txError) return txError;
  const txMessage = payload.transactionResponse?.messages?.[0]?.description;
  if (txMessage) return txMessage;
  const topMessage = payload.messages?.message?.[0]?.text;
  if (topMessage) return topMessage;
  return "Payment gateway error.";
}

function withAuthHint(message: string): string {
  if (!/invalid authentication values/i.test(message)) return message;
  const env = getAuthorizeNetEnvironment();
  return `${message} Check that API Login ID, Transaction Key, and Client Key are from the same Authorize.net account and match AUTHNET_ENV/AUTHORIZE_NET_ENV=${env}.`;
}

export function getAcceptJsUrl() {
  return getAuthorizeNetEnvironment() === "production"
    ? "https://js.authorize.net/v1/Accept.js"
    : "https://jstest.authorize.net/v1/Accept.js";
}

export async function chargeCardToken(
  input: ChargeCardTokenInput,
): Promise<ChargeCardTokenResult> {
  const { apiLoginId, transactionKey } = assertAuthorizeNetEnv();

  const payload = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: apiLoginId,
        transactionKey,
      },
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: input.amount,
        payment: {
          opaqueData: input.opaqueData,
        },
        order: {
          invoiceNumber: input.invoiceNumber,
          description: input.orderDescription || "Headless WooCommerce checkout",
        },
        customer: input.customerEmail ? { email: input.customerEmail } : undefined,
      },
    },
  };

  const response = await fetch(getAuthorizeNetEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as AuthorizeNetApiResponse;
  const responseCode = data.transactionResponse?.responseCode;
  const approved = response.ok && responseCode === "1";

  return {
    approved,
    transactionId: data.transactionResponse?.transId,
    responseCode,
    authCode: data.transactionResponse?.authCode,
    avsResultCode: data.transactionResponse?.avsResultCode,
    cvvResultCode: data.transactionResponse?.cvvResultCode,
    rawMessage: withAuthHint(pickBestMessage(data)),
  };
}

export function toAuthorizeNetAmount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Invalid amount for payment.");
  }
  return formatMoney(value);
}
