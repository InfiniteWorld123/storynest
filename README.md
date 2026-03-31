# StoryNest

StoryNest is a full-stack writing and reading app built with TanStack Start + Better Auth + Drizzle/Postgres.
It supports:

- email/password auth with verification + reset
- public story library and story detail pages
- authenticated workspace for writing/editing stories
- reactions, comments, and read-later flows
- account settings (profile, email change, password change, account deletion)
- cover image uploads (UploadThing)
- contact form email delivery (Resend)

## Tech Stack

- Framework: TanStack Start (React + TanStack Router + Server Functions)
- Auth: Better Auth
- Database: Postgres (Neon in production) + Drizzle ORM
- Styling/UI: Tailwind CSS + Radix + Framer Motion
- Storage uploads: UploadThing
- Email: Resend
- Tests: Vitest
- Deployment: Vercel

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create local env file:

```bash
cp .env.example .env
```

3. Update `.env` values for your local stack.

4. Run migrations:

```bash
pnpm db:migrate
```

5. Start dev server:

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

## Environment Variables

| Name | Required | Purpose |
| --- | --- | --- |
| `BASE_URL` | Yes | App origin used by Better Auth callbacks/emails |
| `BETTER_AUTH_SECRET` | Yes | Better Auth secret |
| `DATABASE_URL` | Yes | Postgres connection string |
| `RESEND` | Yes | Resend API key |
| `EMAIL_FROM` | Yes | Sender for auth/contact emails |
| `CONTACT_TO_EMAIL` | Yes | Inbox target for contact form |
| `UPLOADTHING_TOKEN` | Yes | UploadThing token |
| `ENABLE_SEED_ROUTES` | Optional | Enables `/api/seed-stories`; keep `false` in production |

## Database and Migrations

- Drizzle config: [`drizzle.config.ts`](/Users/yamamwarda/Desktop/storynest/drizzle.config.ts)
- Schema: [`src/db/schema.ts`](/Users/yamamwarda/Desktop/storynest/src/db/schema.ts)
- Migration command:

```bash
pnpm db:migrate
```

For production (Neon), run migrations before first release and whenever schema changes.

## Auth Email Setup

- Better Auth server config: [`src/lib/auth.server.ts`](/Users/yamamwarda/Desktop/storynest/src/lib/auth.server.ts)
- Outbound mail helper: [`src/lib/mailer.ts`](/Users/yamamwarda/Desktop/storynest/src/lib/mailer.ts)

Configure:

- `RESEND`
- `EMAIL_FROM`
- `BASE_URL`

Sign-up verification and reset-password emails use these values.

## UploadThing Setup

- Upload router: [`src/server/uploadthing.ts`](/Users/yamamwarda/Desktop/storynest/src/server/uploadthing.ts)
- API route: [`src/routes/api/uploadthing.ts`](/Users/yamamwarda/Desktop/storynest/src/routes/api/uploadthing.ts)

Set `UPLOADTHING_TOKEN` in local and Vercel environments.

## Contact Form

- Validation: [`src/validation/contact.schema.ts`](/Users/yamamwarda/Desktop/storynest/src/validation/contact.schema.ts)
- Server action: [`src/server/contact.ts`](/Users/yamamwarda/Desktop/storynest/src/server/contact.ts)
- UI: [`src/components/marketing/contact/contact-form-card.tsx`](/Users/yamamwarda/Desktop/storynest/src/components/marketing/contact/contact-form-card.tsx)

Contact form includes:

- schema validation
- honeypot field
- minimum form-fill timing guard
- server-side delivery through Resend

## Scripts

```bash
pnpm dev         # local dev server on port 3000
pnpm typecheck   # TypeScript checks
pnpm test        # Vitest suite
pnpm build       # production build
pnpm check       # typecheck + test + build
pnpm db:migrate  # apply Drizzle migrations
```

## CI

GitHub Actions workflow:

- [`/.github/workflows/ci.yml`](/Users/yamamwarda/Desktop/storynest/.github/workflows/ci.yml)

Runs on PRs and `main`:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Deployment (Vercel + Neon)

1. Push repository to GitHub (private first).
2. Create Neon Postgres database and copy `DATABASE_URL`.
3. Connect repo to Vercel.
4. Add env vars for Preview + Production:
   - `BASE_URL`
   - `BETTER_AUTH_SECRET`
   - `DATABASE_URL`
   - `RESEND`
   - `EMAIL_FROM`
   - `CONTACT_TO_EMAIL`
   - `UPLOADTHING_TOKEN`
   - `ENABLE_SEED_ROUTES=false`
5. Run `pnpm db:migrate` against Neon before first production launch.
6. Verify:
   - auth flows + emails
   - story CRUD
   - reactions/comments/read-later
   - settings actions
   - contact form delivery

## Seed Route Policy

`/api/seed-stories` is development-only by default and must remain disabled in production unless explicitly needed.

## Known Limitation (v1)

Account deletion removes relational data from the database through cascade rules, but does not remove external media objects already stored in third-party storage.
