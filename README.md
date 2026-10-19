# TrAMS Web

The official website for **Trondheim Akuttmedisinske Studentforening (TrAMS)**: public pages, course booking, event signup with waitlists, and an admin area for managing events, participants and users.

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) with [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **CMS:** [Sanity](https://www.sanity.io/) (Studio embedded in the app)
- **Database / Auth:** [Supabase](https://supabase.com/)
- **Email:** [Resend](https://resend.com/)
- **Course bookings:** Google Sheets via [googleapis](https://github.com/googleapis/google-api-nodejs-client)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Chakra UI v3](https://chakra-ui.com/), [Ark UI](https://ark-ui.com/), [FullCalendar](https://fullcalendar.io/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Hosting:** [Vercel](https://vercel.com/) (incl. Analytics, Speed Insights and Cron Jobs)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9 or later (22+ recommended)
- npm

### Installation

```bash
git clone git@github.com:TrAMS-dev/TrAMS.git trams-web
cd trams-web
npm install
```

### Environment Configuration

Copy `env.example` to `.env.local` and fill in the values. If you have access to the Vercel project, you can pull them instead with `vercel env pull .env.local`.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Server-only. Never expose with NEXT_PUBLIC_.

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=   # Optional
SANITY_REVALIDATE_SECRET=         # Shared secret for the Sanity webhook

# Google Sheets (course bookings)
GOOGLE_SHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

# Email (Resend). If missing, emails are skipped with a warning.
RESEND_API_KEY=

# Vercel Cron sends this as a Bearer token to /api/cron/*
CRON_SECRET=

# Optional overrides
NEXT_PUBLIC_SITE_URL=             # Default: https://www.trams.no (used in email links)
WEB_NOTIFY_EMAIL=                 # Default: web@trams.no
ADMIN_EMAIL=                      # Default: ekstern@trams.no
ADMIN_EMAIL_LEVANGER=             # Default: levanger@trams.no
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- **`/app`**: Next.js App Router.
  - **`/(general)`**: Public pages (om oss, arrangementer, førstehjelpskurs, for medisinstudenter, instruktører).
  - **`/admin`**: Admin area behind Supabase auth: events (`arrangement`), attendance (`oppmote`), user approval (`users`), login/registration, and the Sanity Studio (`studio`).
  - **`/api`**: Route handlers for event signup, admin actions, course bookings (`gcloud`, `supabase`), emails (`send`), Sanity revalidation and cron jobs.
- **`/components`**: React components (`/admin` for admin UI, `/ui` for shared primitives).
- **`/lib`**: Server logic such as email templates, waitlist promotion and date helpers.
- **`/hooks`**: Client hooks (e.g. `useAuth`).
- **`/utils`**: Supabase clients (browser, server, admin, session middleware) and Sanity helpers.
- **`/sanity`**: Sanity config, schemas and Studio structure.
- **`/types`**: Generated types for Sanity and Supabase.
- **`/supabase`**: Supabase CLI config.
- **`proxy.ts`**: Refreshes the Supabase session on each request.
- **`EMAILS.md`**: Overview of every email the site sends and when.

## ✏️ Content Management (Sanity)

The Sanity Studio is embedded in the app at [http://localhost:3000/admin/studio](http://localhost:3000/admin/studio) (or `/admin/studio` in production).

Published content is revalidated through a Sanity webhook that calls `/api/revalidate`, signed with `SANITY_REVALIDATE_SECRET`.

## 🔐 Admin & Supabase

Admins register at `/admin/register` and must be approved by an existing admin under `/admin/users` before they get access. Events, signups, waitlists and participant comments are stored in Supabase.

## 🧬 Generated Types

After changing Sanity schemas or the Supabase database schema, regenerate the types:

```bash
npm run typegen
```

This extracts the Sanity schema, generates `types/sanity.types.ts`, and then runs `npm run typegen:supabase` to generate `types/supabase.ts`. Don't edit these files by hand. Generating Supabase types requires being logged in with the Supabase CLI (`npx supabase login`) with access to the project.

## 📧 Emails & Scheduled Jobs

- All emails are sent through Resend from `web@trams.no`. See [EMAILS.md](EMAILS.md) for the full list.
- A Vercel Cron job (`vercel.json`) calls `/api/cron/event-reminders` every day at 07:00 UTC and emails confirmed participants two days before their event.
- A GitHub Actions workflow (`.github/workflows/supabase-keepalive.yml`) pings Supabase daily to stop the project from being paused.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint.
- `npm run typegen`: Generates TypeScript types from Sanity and Supabase.
- `npm run typegen:supabase`: Generates only the Supabase types.

## ☁️ Deployment

The site is deployed on **Vercel** from this repository. Pushes to `master` deploy to production, and other branches (e.g. `dev`) get preview deployments.

When adding a new environment variable, add it to `env.example` and to the Vercel project settings.
