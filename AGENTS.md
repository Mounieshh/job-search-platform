# Job Search Community — AGENTS.md

## Project Overview

A full-stack community-driven job search platform. Users browse jobs, apply with resumes, post jobs (with lead/approval workflow), participate in a community feed, and manage profiles. Roles: **USER**, **LEAD**, **ADMIN**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, shadcn/ui (New York style) |
| Routing | React Router 7 |
| State | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| Backend | Express 5, TypeScript 5.9 |
| Primary DB | MongoDB + Mongoose 9 (users, profiles, sessions, companies, notifications, tokens) |
| Secondary DB | PostgreSQL + Prisma 7 (jobs, applications, community posts, approvals, comments) |
| Auth | Session-based (express-session + connect-mongo), bcrypt, Google OAuth (configured) |
| Storage | Supabase (avatars, resumes), Cloudinary (community images) |
| Email | Nodemailer (verification, reset, lead creds, application status) |
| AI | Google Gemini (application scoring) |
| Logging | Pino |
| Validation | Zod (shared schemas between client/server) |
| Rich Text | TipTap (ProseMirror-based) |
| Tables | AG Grid Community |
| HTTP | Axios (client) |

## Monorepo Structure

```
/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios API call functions (one per domain)
│   │   ├── components/     # Feature-organized components
│   │   │   ├── ui/         # shadcn/ui primitives
│   │   │   ├── shared/     # Navbar, Footer, HeroSection, etc.
│   │   │   └── {feature}/ # admin/, auth/, browseJobs/, community/, postjob/, user/
│   │   ├── hooks/
│   │   │   ├── queries/    # TanStack Query hooks (one per domain)
│   │   │   └── mutations/  # TanStack Mutation hooks (one per domain)
│   │   ├── pages/          # Page-level components
│   │   ├── validate/       # Zod schemas
│   │   ├── lib/            # Utilities (cn(), base URL, Supabase uploads)
│   │   └── types/          # Global type definitions
│   ├── components.json     # shadcn/ui config
│   ├── vite.config.ts
│   └── vercel.json
├── server/           # Express backend
│   ├── src/
│   │   ├── config/         # DB connections, env, Cloudinary, session
│   │   ├── controller/     # Route handlers (one per domain)
│   │   ├── middleware/     # Auth guard, file upload (Multer)
│   │   ├── models/         # Mongoose schemas (one per domain)
│   │   ├── routes/         # Express routers (one per domain)
│   │   ├── utils/          # Mail, upload, generators, helpers
│   │   └── validate/       # Zod schemas
│   ├── prisma/
│   │   └── schema.prisma   # PostgreSQL schema
│   └── uploads/resumes/
└── AGENTS.md
```

## Key Conventions

- **Path aliases**: Client uses `@/*` → `src/*`
- **Naming**: `[domain].controller.ts`, `[domain].route.ts`, `[domain].zod.ts`, `[domain].ts` for API files
- **Components**: PascalCase (`SignInForm.tsx`)
- **Validation**: Zod schemas live in `validate/` on both client and server (nearly identical)
- **API pattern**: Each domain has an API file (`api/*.ts`), query hook (`hooks/queries/*.ts`), and mutation hook (`hooks/mutations/*.ts`)
- **CSS**: Tailwind v4 with CSS variables in `index.css`; light/dark theme via `next-themes`
- **No test framework installed** — both `client/src/tests/` and `server/src/tests/` are empty

## Database Architecture

### MongoDB (Mongoose models)
- `User` — email, hashed password, role (USER|LEAD|ADMIN), verification status
- `Profile` — avatar, work experience, education, skills, links
- `Session` — express-session storage
- `Company` — company details
- `LeadRequest` — pending lead promotion requests
- `Notification` — in-app notifications (types: shortlisted, rejected, application_received, general)
- `CredentialHistory` — audit of credential changes
- `VerificationToken`, `PasswordResetToken`

### PostgreSQL (Prisma schema)
- `PostJob` — job listings (title, company, location, type, mode, salary, description via TipTap HTML, status: draft/pending/approved/rejected)
- `UserApplication` — job applications (resume URL, parsed text, AI score/reason/suggestions, status)
- `JobApproval` — approval audit trail (who approved/rejected at each level: lead, admin)
- `CommunityPost` — community feed posts (content, optional image, isHiring flag, anonymous name/avatar, likes count, author)
- `CommentPost` — comments on community posts

## Core Feature Flow

### Job Posting & Approval
1. USER posts a job → status: `pending`
2. LEAD (company rep) approves/rejects → status: `approved`/`rejected`
3. ADMIN can approve/reject at any level
4. Approved jobs appear in browse page

### Application Scoring
- Resume PDFs are uploaded to Supabase; text is extracted and stored
- Google Gemini scores applications with `aiScore`, `aiReason`, `aiSuggestions`

### Lead System
1. Users apply to become a lead for a company
2. Admin approves → new credentials generated & emailed
3. Old credentials deactivated; credential history recorded
4. Leads can approve jobs and manage applications for their company

## Available Scripts

### Client
| Script | Command |
|---|---|
| `dev` | `vite` (port 5173) |
| `build` | `tsc -b && vite build` |
| `lint` | `eslint .` |
| `preview` | `vite preview` |

### Server
| Script | Command |
|---|---|
| `dev` | `tsx watch src/index.ts` |
| `build` | `prisma db push --accept-data-loss && tsc` |
| `start` | `node dist/index.js` |

## Critical Files

| File | Purpose |
|---|---|
| `server/src/index.ts` | Express app entry (middleware, routes, error handling) |
| `server/prisma/schema.prisma` | Complete PostgreSQL schema |
| `server/src/middleware/auth.middleware.ts` | Session auth + role guard |
| `client/src/App.tsx` | Root component with all routes |
| `client/src/main.tsx` | React entry with QueryClientProvider, ThemeProvider |
| `client/src/index.css` | Tailwind v4 theme (light/dark variables) |
| `client/components.json` | shadcn/ui registry configuration |

## API Routes

All routes mounted under `/api`:

| Route | Controller | Purpose |
|---|---|---|
| `/api/auth/*` | `auth.controller.ts` | Register, login, logout, verify, reset password |
| `/api/user/*` | `profile.controller.ts` | Profile CRUD, resume upload |
| `/api/jobs/*` | `postjob.controller.ts` | Create, browse, apply, manage applications |
| `/api/community/*` | `community.controller.ts` | Posts, likes, comments |
| `/api/lead/*` | `lead.controller.ts` | Lead approvals, application management |
| `/api/admin/*` | `admin.controller.ts` | Dashboard, job/lead/community management |
| `/api/company/*` | `company.controller.ts` | Company directory, user management |
| `/api/notifications/*` | `notification.controller.ts` | Fetch/mark read |
