declare global {
  interface Window {
    Accept: {
      dispatchData: (
        secureData: {
          authData: {
            apiLoginID: string;
            clientKey: string;
          };
          cardData: {
            cardNumber: string;
            month: string;
            year: string;
            cardCode: string;
          };
        },
        callback: (response: {
          opaqueData?: {
            dataDescriptor?: string;
            dataValue?: string;
          };
          messages?: {
            resultCode?: "Ok" | "Error";
            message?: Array<{ code?: string; text?: string }>;
          };
        }) => void,
      ) => void;
    };
  }
}

export {};
