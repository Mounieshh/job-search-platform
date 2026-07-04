# Job Search Community — Client

Community-driven job search platform frontend. Three roles: **USER**, **LEAD** (company rep), **ADMIN**.

Users browse approved jobs, apply with resumes, post jobs (pending lead/admin approval), participate in a community feed with anonymous posting, and manage their profiles. Leads approve jobs and manage applications for their company. Admins oversee the entire platform.

## Tech Stack

- **React 19** — UI framework
- **TypeScript 5.9** — Language
- **Vite 7** — Build tool / dev server
- **Tailwind CSS 4** — Utility-first CSS
- **shadcn/ui** (New York) — Radix-based component library
- **React Router 7** — Client-side routing
- **TanStack React Query 5** — Server state (queries + mutations)
- **React Hook Form + Zod** — Form validation
- **Axios** — HTTP client to Express API
- **TipTap** — Rich text editor (ProseMirror)
- **AG Grid Community** — Data tables
- **Supabase JS** — File storage (avatars, resumes)
- **Sonner** — Toast notifications
- **next-themes** — Dark/light mode

## Database

**MongoDB** (Mongoose) stores users, profiles, sessions, companies, lead requests, notifications, and tokens — document-flexible data.

**PostgreSQL** (Prisma) stores job listings, applications, approval audits, community posts, and comments — relational data with strict schemas and foreign keys.

All data flows through Express REST routes under `/api` — the client never touches databases directly.
