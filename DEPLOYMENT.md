# Deploying Dhana Sri Sarees

Stack: **Next.js** (`apps/web`) on Vercel, **Express/Prisma** (`apps/api`) on Render, **PostgreSQL** on Neon or Supabase. No local server is required — everything below runs in each provider's dashboard/CLI against your deployed services.

Deploy in this order: **database → API → Razorpay webhook → frontend**. Each step needs the output of the one before it.

---

## 1. Database (Neon or Supabase)

1. Create a new Postgres project on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the connection string (Neon: use the **pooled** connection string; Supabase: Project Settings → Database → Connection string → URI, port `6543` with `?pgbouncer=true` for the pooled variant). You'll set this as `DATABASE_URL` on Render.
3. Nothing else to do here manually — migrations run from the API's deploy step below.

---

## 2. Backend API (Render)

1. Push this repo to GitHub (`git push` to your remote).
2. On [Render](https://render.com): **New → Web Service**, connect the repo, and set:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter is fine to begin with.
3. Add environment variables (Render dashboard → Environment):

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | connection string from step 1 |
   | `PORT` | `4000` (Render sets `PORT` itself — this is only used for local dev, Render's env var takes precedence) |
   | `CORS_ORIGIN` | your Vercel URL, e.g. `https://dhana-sri-sarees.vercel.app` (update after step 4 deploys) |
   | `JWT_SECRET` | a long random string — generate with `openssl rand -hex 32` |
   | `JWT_EXPIRES_IN` | `30d` |
   | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | from Razorpay Dashboard → Settings → API Keys |
   | `RAZORPAY_WEBHOOK_SECRET` | set in step 3 below |
   | `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | optional — leave blank to have OTP codes logged to the Render service logs instead of sent by SMS (useful for demoing before you have a Twilio number) |

4. Deploy. Once live, note the service URL, e.g. `https://dhana-sri-sarees-api.onrender.com`.
5. Seed the catalog once, from your machine, pointed at the production database:
   ```bash
   cd apps/api
   DATABASE_URL="<paste the Neon/Supabase connection string>" npm run seed
   ```
   This is the one command that touches the production DB directly — review the values in `prisma/seed.ts` first if you want different starter products/coupons/categories.
6. Sanity check: `curl https://<your-render-url>/health` should return `{"ok":true}`, and `curl https://<your-render-url>/products` should return seeded products.

---

## 3. Razorpay webhook

1. In the [Razorpay Dashboard](https://dashboard.razorpay.com) → **Account & Settings → Webhooks**, add a webhook:
   - **URL**: `https://<your-render-url>/webhooks/razorpay`
   - **Active events**: `payment.captured`, `payment.failed`
   - Set a secret — paste this same value into Render's `RAZORPAY_WEBHOOK_SECRET` env var and redeploy the API.
2. Switch from Razorpay **Test mode** to **Live mode** keys (and matching webhook) once you're ready to accept real payments; keep test-mode keys while developing.

---

## 4. Frontend (Vercel)

1. On [Vercel](https://vercel.com): **New Project**, import the repo, and set:
   - **Root Directory**: `apps/web`
   - Framework preset: Next.js (auto-detected)
2. Add environment variables (Vercel dashboard → Settings → Environment Variables), for all environments:

   | Key | Value |
   |---|---|
   | `API_URL` | `https://<your-render-url>` (used server-side, e.g. `https://dhana-sri-sarees-api.onrender.com`) |
   | `NEXT_PUBLIC_API_URL` | same value — this one is exposed to the browser for OTP login and checkout calls |

3. Deploy. Vercel's build fetches products from the live API during prerendering, so **the Render API must already be deployed and reachable** before this build runs (that's why it's step 2, not step 4, in dependency order).
4. Copy the resulting Vercel URL and go back to Render's `CORS_ORIGIN` env var — set it to this URL and redeploy the API so browser requests from the frontend aren't blocked by CORS.

---

## 5. Verify the golden path

1. Visit the deployed site → Home page shows seeded products under "New Arrivals".
2. Add a saree to the cart → Cart page shows correct totals.
3. Click **Proceed To Pay** → Checkout page → **Login to Pay** → enter a phone number.
   - If Twilio isn't configured, find the 6-digit code in the Render service logs (`[dev-otp] OTP for <phone>: <code>`).
4. Enter the OTP → **Pay** → Razorpay checkout opens (use a [Razorpay test card](https://razorpay.com/docs/payments/payments/test-card-details/) while in test mode).
5. On payment success you're redirected to `/order-confirmation/<id>`, which polls until the webhook marks the order `paid` (usually 1–2 seconds).

If the confirmation page hangs on "Confirming your payment…", check Render's logs for the `/webhooks/razorpay` request — it usually means the webhook URL or secret is misconfigured (step 3).

---

## Notes on the architecture

- **Auth** uses a JWT returned from `POST /auth/otp/verify` and sent as `Authorization: Bearer <token>` from the browser — not cookies. This avoids third-party-cookie restrictions (Safari ITP etc.) between the Vercel and Render domains.
- **Cart/wishlist** stay client-side (Zustand + `localStorage`) for both guests and logged-in users, matching the plan's "localStorage before login" rule. Checkout submits the cart's `productId`/`qty` pairs to the API, which re-prices everything server-side from the live database — the client never dictates a price. The backend's `/cart` and `/wishlist` REST endpoints exist and are fully functional (guest-cookie based) for future use if you want to move to DB-backed cart sync later; the current frontend doesn't call them.
- **Stock** is decremented only after Razorpay confirms `payment.captured` via the webhook, not at order creation — so an abandoned checkout never wrongly reduces inventory.
