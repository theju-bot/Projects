# AI Job Tracker

A full-stack job application tracker built with Next.js. Organize opportunities on a drag-and-drop Kanban board, review pipeline analytics, and generate stage-aware career content with OpenRouter-powered AI—all behind per-user authentication and encrypted API key storage.

**Author:** Thesigan  
**Repository:** [github.com/theju-bot/Projects](https://github.com/theju-bot/Projects) (this app lives in the `ai-job-tracker/` directory)  
**Live demo:** [ai-job-tracker-lemon.vercel.app](https://ai-job-tracker-lemon.vercel.app/)

## Overview

AI Job Tracker helps you manage an active job search in one place. Each account gets a personalized Kanban workflow with default stages (Saved, Applying, Applied, Interview, Offer, Rejected), full CRUD for jobs and columns, and AI assistants that adapt to where a role sits in your pipeline. Profile fields (target role, skills, experience, bio) feed into prompts so generated text reflects your background.

## Features

### Kanban board
- Drag-and-drop jobs between columns using [@dnd-kit](https://dndkit.com)
- Reorder jobs within a column; changes persist via the API
- Add, edit, and delete job cards (title, company, location, URL, salary, description, notes)
- Rename, recolor, and remove columns; add custom columns
- Search jobs by title or company from the dashboard navbar

### Analytics
- Summary stats: total jobs, applied, interviews, offers, rejected, response rate
- Bar chart of jobs by pipeline stage
- Pie chart of stage distribution
- Horizontal funnel: tracked → applied → interview → offer

### AI assistance (OpenRouter)
Per-job actions vary by column stage:

| Stage | AI actions |
|-------|------------|
| Saved | Analyze fit (gap analysis) |
| Applying | Cover letter |
| Applied | Follow-up email |
| Interview | Interview prep |
| Offer | Cover letter |
| Rejected | Rejection analysis |

Additional prompts live under `lib/ai/prompts/`. Users supply their own OpenRouter API key in Settings; keys are encrypted at rest with AES.

### Authentication and security
- Email/password and Google OAuth via [Better Auth](https://www.better-auth.com)
- Session-based access to dashboard routes
- Route protection in `proxy.ts` (redirects unauthenticated users to login)
- New users receive default Kanban columns automatically on signup

### Settings
- Profile: target role, skills, years of experience, bio, preferred OpenRouter model
- Encrypted OpenRouter API key management (save / remove)
- Light and dark theme toggle

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Data | MongoDB, Mongoose |
| Auth | Better Auth (MongoDB adapter) |
| Client state | Redux Toolkit, TanStack React Query |
| Forms | React Hook Form, Zod |
| Drag and drop | @dnd-kit/core, @dnd-kit/sortable |
| Charts | Recharts |
| AI | OpenRouter Chat Completions API |
| E2E tests | Playwright |

## Project structure

```text
ai-job-tracker/
├── app/
│   ├── (auth)/              # Login and register
│   ├── (dashboard)/         # Board, analytics, settings
│   └── api/                 # REST API routes
├── components/
│   ├── board/               # Kanban board, columns, cards
│   ├── jobs/                # Job forms and modals
│   ├── ai/                  # AI action UI and output dialog
│   ├── settings/            # Profile and API key forms
│   ├── shared/              # Navbar, sidebar, theme toggle
│   └── ui/                  # shadcn/ui primitives
├── hooks/                   # React Query hooks (jobs, columns, AI, settings)
├── lib/
│   ├── ai/                  # OpenRouter client, prompts, context
│   ├── auth/                # Better Auth server and client
│   ├── db/                  # MongoDB connection
│   ├── errors/              # AppError and API error handler
│   └── validations/         # Zod schemas
├── models/                  # Mongoose Job and Column schemas
├── store/                   # Redux store and UI slice
├── types/                   # Shared TypeScript types
├── tests/                   # Playwright E2E specs
└── proxy.ts                 # Auth redirects for protected routes
```

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- Google OAuth credentials (optional, for Google sign-in)
- OpenRouter API key (per user, configured in the app after login)

### Installation

Clone the monorepo and enter the app directory:

```bash
git clone https://github.com/theju-bot/Projects.git
cd Projects/ai-job-tracker
npm install
```

### Environment variables

Create `.env.local` in the project root:

```bash
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/ai-job-tracker

# Better Auth
BETTER_AUTH_SECRET=your-random-secret-at-least-32-chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Encrypts user OpenRouter keys at rest
ENCRYPTION_KEY=your-encryption-passphrase-16-chars-min

# E2E tests only (see Testing)
TEST_SECRET=local-dev-test-secret
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `BETTER_AUTH_SECRET` | Yes | Secret for signing sessions and tokens |
| `BETTER_AUTH_URL` | Yes | App base URL used by Better Auth (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_AUTH_URL` | Yes | Same base URL, exposed to the auth client |
| `GOOGLE_CLIENT_ID` | For Google login | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google login | OAuth client secret |
| `ENCRYPTION_KEY` | Yes | Passphrase for AES encryption of OpenRouter keys |
| `TEST_SECRET` | For E2E only | Protects `/api/test/seed` during Playwright setup |
| `TEST_USER_EMAIL` | Optional | Override default test user email |
| `TEST_USER_PASSWORD` | Optional | Override default test user password |
| `MONGODB_DB` | Optional | Database name override for test seeding |

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects to `/dashboard`.

### Production build

```bash
npm run build
npm start
```

## API reference

All JSON routes require an authenticated session unless noted.

| Method | Route | Description |
|--------|-------|-------------|
| `*` | `/api/auth/[...all]` | Better Auth handlers (login, register, OAuth, session) |
| `GET` | `/api/jobs` | List jobs for the current user |
| `POST` | `/api/jobs` | Create a job |
| `GET` | `/api/jobs/[id]` | Get one job |
| `PATCH` | `/api/jobs/[id]` | Update or move a job |
| `DELETE` | `/api/jobs/[id]` | Delete a job |
| `GET` | `/api/columns` | List columns |
| `POST` | `/api/columns` | Create a column |
| `PATCH` | `/api/columns/[id]` | Update a column |
| `DELETE` | `/api/columns/[id]` | Delete a column |
| `POST` | `/api/ai/[feature]` | Run an AI feature (`cover-letter`, `gap-analysis`, `cold-email`, `follow-up`, `interview-prep`, `rejection-analysis`) |
| `GET` | `/api/user/settings` | Check whether an OpenRouter key is stored |
| `POST` | `/api/user/settings` | Save encrypted OpenRouter key |
| `DELETE` | `/api/user/settings` | Remove stored OpenRouter key |
| `POST` | `/api/log` | Client-side log forwarding |
| `POST` | `/api/test/seed` | Reset test user (E2E only; requires `x-test-secret` header) |

## AI configuration

1. Sign in and open **Settings**.
2. Complete your profile so prompts include role, skills, and experience.
3. Add an [OpenRouter](https://openrouter.ai) API key.
4. Optionally set a preferred model (defaults to `operouter/free` if unset).
5. Open a job card on the board and use the stage-appropriate AI actions.

Prompt templates are in `lib/ai/prompts/`. The OpenRouter client is in `lib/ai/openrouter.ts`.

## Testing

End-to-end tests use Playwright. Global setup seeds the database and saves an authenticated session to `playwright/.auth/user.json`.

```bash
# Ensure TEST_SECRET (and other env vars) are in .env.local
npm run test:e2e
npm run test:e2e:ui      # interactive UI mode
npm run test:e2e:headed  # visible browser
```

Specs cover registration, auth flows, and authenticated dashboard/Kanban rendering.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright tests |

## Troubleshooting

**Application fails to start**  
Confirm `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_AUTH_URL`, and `ENCRYPTION_KEY` are set. `BETTER_AUTH_URL` must match the URL you use in the browser.

**Cannot sign in with Google**  
Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, and that the OAuth redirect URI matches your Better Auth configuration.

**AI actions return an error**  
Add a valid OpenRouter key in Settings. Ensure `ENCRYPTION_KEY` has not changed after saving a key (changing it invalidates stored keys).

**MongoDB connection errors**  
Check that MongoDB is running and that the connection string includes the correct host, credentials, and database name.

## License

MIT — Copyright (c) 2026 Thesigan
