# Dhana Sri Sarees

Full-stack e-commerce storefront: Next.js frontend, Express/Prisma/PostgreSQL backend, Razorpay checkout, phone OTP auth.

```
apps/
  web/    Next.js 16 (App Router) storefront — catalog, cart, wishlist, checkout, OTP login
  api/    Express + Prisma REST API — products, cart, wishlist, orders, OTP auth, Razorpay + webhook
infra/
  docker-compose.yml   local Postgres for development
plan/
  buildplan             the design → module → architecture plan this app was built from
```

## Local development

Requires Node 20+ and a Postgres instance (`docker compose -f infra/docker-compose.yml up -d`, or a local install).

```bash
# Backend
cd apps/api
cp .env.example .env        # fill in DATABASE_URL at minimum
npm install
npx prisma migrate dev
npm run seed
npm run dev                 # http://localhost:4000

# Frontend (separate terminal)
cd apps/web
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

Without `TWILIO_*` env vars set, OTP codes are printed to the API's console instead of sent by SMS — enough to log in and test checkout locally. Without `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`, checkout will fail at the "create order" step; everything else works.

## Deploying

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Vercel + Render + Neon/Supabase walkthrough — no local server required for production.
