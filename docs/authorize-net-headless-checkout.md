# Authorize.net + WooCommerce Headless Checkout

This project uses **Authorize.net Accept.js** to tokenize card data in-browser and sends only `opaqueData` to `/api/checkout`.

## File Structure

- `src/app/pages/CheckoutPage.tsx`: checkout UI, form validation, Accept.js tokenization, submit flow.
- `src/app/api/checkout/route.ts`: secure checkout endpoint that creates Woo order, charges card, and updates order status.
- `src/app/lib/woocommerce/orders.ts`: WooCommerce order create/update helpers and order-note helpers.
- `src/app/lib/payments/authorizenet.ts`: Authorize.net charge function and environment-aware endpoints.
- `src/types/acceptjs.d.ts`: Accept.js browser typings.
- `.env.example`: required environment variables.

## Sandbox Testing

Use `AUTHORIZE_NET_ENV=sandbox` (or `AUTHNET_ENV=sandbox`) and test credentials from your Authorize.net sandbox account.

- Accept.js URL: `https://jstest.authorize.net/v1/Accept.js`
- Transaction API URL: `https://apitest.authorize.net/xml/v1/request.api`
- Test card: `4111111111111111`
- Example expiry: `12/30`
- Example CVV: `123`

### End-to-End Test Cases

1. Token generation succeeds (Accept.js returns `opaqueData`).
2. Woo order is created in `pending` status.
3. Payment capture succeeds and order moves to `processing` with transaction id metadata.
4. Payment failure moves order to `failed` and writes a note.
5. API validation rejects empty cart or invalid billing data.

## Live Deployment Switch

1. Update `.env.local` (use either the `AUTHORIZE_NET_*` or `AUTHNET_*` naming set):
   - `AUTHORIZE_NET_ENV=production` (or `AUTHNET_ENV=production`)
   - Live `AUTHORIZE_NET_API_LOGIN_ID` (or `AUTHNET_API_LOGIN_ID`)
   - Live `AUTHORIZE_NET_TRANSACTION_KEY` (or `AUTHNET_TRANSACTION_KEY`)
   - Live `NEXT_PUBLIC_AUTHORIZE_NET_CLIENT_KEY` (or `NEXT_PUBLIC_AUTHNET_CLIENT_KEY`)
2. Redeploy the Next.js app so env vars refresh.
3. Run a low-value real card test in production.
4. Confirm Woo orders are marked `processing` and include `_authorize_net_transaction_id`.

## Security Checklist

- Never log raw card number, CVV, or `opaqueData.dataValue`.
- Keep `AUTHORIZE_NET_TRANSACTION_KEY` server-side only.
- Use HTTPS everywhere (frontend + API).
- Validate checkout payload server-side (`/api/checkout`).
- Keep API credentials in env vars only (`.env.local`, host secret manager).
- Rotate Woo and Authorize.net keys periodically.
- Implement webhook signature verification before processing any future webhooks.
