# Dhana Sri Sarees

Full-stack e-commerce storefront: Next.js frontend, Express/Prisma/PostgreSQL backend, Razorpay checkout, phone OTP auth.

```
apps/
  web/    Next.js 16 (App Router) storefront — catalog, cart, wishlist, checkout, OTP login
  admin/  Next.js 16 admin panel — product/inventory/order management (port 3001)
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
npx prisma db push
npm run seed
npm run dev                 # http://localhost:4000

# Frontend (separate terminal)
cd apps/web
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000

# Admin panel (separate terminal)
cd apps/admin
cp .env.example .env.local  # same Firebase project as apps/web
npm install
npm run dev                 # http://localhost:3001
```

Customer login is Firebase **Phone** auth (OTP codes are sent by Firebase
itself, client-side — no Twilio/SMS config needed on the API). Without
`RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`, checkout will fail at the "create
order" step; everything else works.

### Admin access

The admin panel logs in with Firebase **Email/Password** (enable that sign-in
provider in Firebase Console → Authentication → Sign-in method — it's a
separate provider from the customer-facing Phone OTP). Staff roles
(`super_admin`/`admin`/`employee`) live in Postgres (the `Staff` table), not
in a Firebase claim, so a role change or deactivation takes effect on that
staff member's very next request — no token refresh needed. There's no
self-serve admin signup; seed the first Super Admin with:

```bash
cd apps/api
npm run bootstrap-super-admin -- you@example.com --password 'some-password'
```

`apps/api`'s `CORS_ORIGIN` must list both frontend origins, comma-separated:
`http://localhost:3000,http://localhost:3001`.

## Deploying

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Vercel + Render + Neon/Supabase walkthrough — no local server required for production.
