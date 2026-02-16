# DR Muhid Lab – Setup Guide

Follow these steps to run the platform locally and connect it to Supabase.

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the dashboard, open **SQL Editor**.
3. Open `supabase/schema.sql` in this repo and copy its full contents.
4. Paste into the SQL Editor and **Run**.
5. In **Table Editor**, confirm that `profiles`, `courses`, `course_images`, `reviews`, `payments`, and `user_course_access` exist.

---

## 3. Storage bucket (course images)

Course images are stored in Supabase Storage. Create the bucket and then apply the storage policies from the schema.

1. In Supabase: **Storage** → **New bucket**.
2. **Name**: `course-images`.
3. **Public bucket**: turn **ON** (so course images can be shown without signed URLs).
4. (Optional) Under **Configuration** set **File size limit** (e.g. 5MB) and **Allowed MIME types** (e.g. `image/jpeg`, `image/png`, `image/webp`, `image/gif`).
5. Click **Create bucket**.

If you have not yet run the full `schema.sql`, run at least the **Storage** section (the `CREATE POLICY` statements for `storage.objects`). Those policies allow:

- Public read for `course-images`.
- Only admins to upload, update, and delete objects in `course-images`.

---

## 4. Environment variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```
2. In Supabase: **Settings** → **API**.
3. In `.env.local` set:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key.
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (keep secret).

---

## 5. Google OAuth (optional but recommended)

### Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create or select a project.
3. Enable **Google+ API** (or the relevant Google identity APIs).
4. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth 2.0 Client ID**.
5. Application type: **Web application**.
6. Under **Authorized redirect URIs** add:
   `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback`
   (use your project ref from Supabase URL).
7. Copy **Client ID** and **Client Secret**.

### Supabase Dashboard

1. **Authentication** → **Providers**.
2. Enable **Google**.
3. Paste Client ID and Client Secret → Save.

---

## 6. Auth URL configuration

In Supabase: **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:3000` (or your production URL).
- **Redirect URLs**: add `http://localhost:3000/**` (and your production URL pattern if needed).

---

## 7. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 8. Create an admin user

1. Sign in with Google (or your configured auth) so a row is created in `profiles`.
2. In Supabase **SQL Editor**, run (use your own email):

   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```

3. Refresh the app. You should have admin access (e.g. `/admin`).

---

## What you have to do (checklist)

| Step | Action |
|------|--------|
| 1 | Run `npm install`. |
| 2 | Create Supabase project and run `supabase/schema.sql` in SQL Editor. |
| 3 | In Storage, create a **public** bucket named `course-images`; ensure the storage RLS policies from `schema.sql` are applied. |
| 4 | Copy `.env.example` to `.env.local` and fill in Supabase URL, anon key, and service role key. |
| 5 | (Optional) Configure Google OAuth in Google Cloud and in Supabase Auth providers. |
| 6 | Set Site URL and Redirect URLs in Supabase Auth URL configuration. |
| 7 | Run `npm run dev` and open the app. |
| 8 | Sign in once, then set your user’s `profiles.role` to `admin` via SQL. |

---

## Course images (behavior)

- **Thumbnail**: In the course form, use **Upload image** to pick a file; it is uploaded to the `course-images` bucket and the public URL is saved in `courses.thumbnail_url`. You can also paste a URL.
- **Additional images**: Use **Upload image** to add files to Storage; their URLs are stored in `course_images` (one row per image, with `image_url` and `sort_order`). You can also add image URLs manually with **Add URL** and the URL fields.
- Only **admins** can upload; the app uses the anon key and relies on RLS so that only users with `role = 'admin'` can insert/update/delete in the `course-images` bucket.

---

## Common issues

- **OAuth redirect errors**  
  Redirect URI in Google Cloud must match exactly the Supabase callback URL (including `/auth/v1/callback`).

- **Database / RLS errors**  
  Ensure the full `schema.sql` was run and that the storage policies for `storage.objects` are in place.

- **Upload denied (403)**  
  Confirm the bucket is created, the storage policies from `schema.sql` are applied, and your user has `role = 'admin'` in `profiles`.

- **Admin area not visible**  
  Check that `profiles.role = 'admin'` for your user and that you’re signed in with that user.
