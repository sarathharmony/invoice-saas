# invoice-saas — Distribute-as-SaaS test harness

Minimal invoicing SaaS (NestJS backend + Next.js frontend) used to smoke-
test the **SaaS Distribution** flow on the ACE platform end-to-end.

This is the parent app we publish privately to ACE and then re-publish as
`DISTRIBUTE_AS_SAAS` with a 30-day trial. Clients click *Run as Client
Application*, fill in `STRIPE_SECRET_KEY` / `COMPANY_NAME`, and get a
dedicated Cloud Run stack (Cloud SQL database provisioned automatically,
Redis not required).

## Features

- Create invoices with line items + VAT %
- Email the invoice URL to the customer
- Accept Stripe payment via a generated payment link
- Daily summary dashboard

## Local dev

```bash
pnpm install
pnpm --filter backend start:dev       # http://localhost:3000
pnpm --filter frontend dev            # http://localhost:3001
```

## Publishing via ACE

```bash
ace login
ace publish parent-app --visibility PRIVATE

ace publish parent-app --visibility DISTRIBUTE_AS_SAAS \
  --trial-days 30 \
  --min-instance-type e2-medium \
  --saas-monthly-price-cents 4900 \
  --saas-subscribe-url https://your-stripe-checkout-url
```

Env var schema comes from `ace.json#envVars`. ACE enforces every
`required: true` field during the Run-as-Client wizard. Fields marked
`injected: true` (e.g. `DATABASE_URL`) are filled in by the platform at
provisioning time and hidden from the wizard.

## Runtime contract

When ACE provisions a Client Application as Cloud Run:

- `DATABASE_URL` — pointed at the Client's dedicated db on the shared Cloud SQL instance (injected)
- `STRIPE_SECRET_KEY` / `COMPANY_NAME` / `COMPANY_ADDRESS` — pasted by the Client in the wizard
- `PORT=3000` for backend, `PORT=3001` for frontend — set by Cloud Run
- `NEXT_PUBLIC_API_URL=/api` — frontend proxies /api to the backend Cloud Run service

Each service is deployed as its own Cloud Run service:

- `svc-<clientAppId>-backend` — NestJS (containerPort 3000)
- `svc-<clientAppId>-frontend` — Next.js (containerPort 3001, public)

`maxInstances: 1` is set by default so the backend's in-memory invoice
store stays consistent. If you rework the app to use Cloud SQL for
state, bump `maxInstances` and enable horizontal scale-out.
