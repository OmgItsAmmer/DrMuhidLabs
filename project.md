# Project structure

## UI (frontend)

| Where | What |
|-------|------|
| **`app/`** | Next.js App Router: routes (pages), layouts, and API routes. |
| **`app/**/page.tsx`** | Route pages: home (`app/page.tsx`), login, dashboard, admin, courses, buy, my-courses, etc. |
| **`app/**/layout.tsx`** | Shared layouts (root, dashboard, admin). |
| **`app/globals.css`** | Global styles. |
| **`components/`** | Reusable UI: `admin/` (CourseModal, AdminNav), `landing/LandingPage`, `course/ReviewForm`. |

Pages and components are the UI layer; they render HTML and call server logic (see below).

---

## Backend / data layer

| Where | What |
|-------|------|
| **`lib/actions/`** | **Server Actions** (`'use server'`): `auth.ts`, `courses.ts`, `customers.ts`, `payments.ts`, `upload.ts`. They run on the server and talk to Supabase. |
| **`lib/supabase/`** | Supabase client setup: `server.ts` (for Server Components/API), `client.ts` (browser), `middleware.ts` (session refresh). |
| **`app/api/`** | REST API routes: `POST/GET /api/admin/courses`, `PATCH/DELETE /api/admin/courses/[id]`. Used for admin course create/update (e.g. from CourseModal). |
| **`supabase/schema.sql`** | Database schema (tables, RLS, etc.). Real DB and Auth live in Supabase (hosted). |

So: “backend” in this repo = Server Actions + API routes + Supabase client wiring; the actual database and auth are in Supabase.

---

## How they communicate

1. **Server Actions**  
   Pages and components import functions from `@/lib/actions/*` (e.g. `getCourses`, `getUser`, `submitPayment`, `addReview`) and call them directly. Next.js runs these on the server and handles serialization; no manual `fetch` for these.

2. **REST API**  
   `CourseModal` uses `fetch()` to call:
   - `POST /api/admin/courses` (create),
   - `PATCH /api/admin/courses/[id]` (update).  
   Used for admin course create/update with JSON body.

3. **Supabase**  
   Both Server Actions and API routes use `createClient()` from `lib/supabase/server` to read/write the database and check auth. So: **UI → Server Actions or API routes → Supabase (DB + Auth)**.

Summary: UI lives in `app/` and `components/`; server logic in `lib/actions/` and `app/api/`; they talk via direct Server Action calls or `fetch` to `/api/`; everything that touches data goes through the Supabase client.
