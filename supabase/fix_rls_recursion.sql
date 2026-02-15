-- =============================================
-- Fix: infinite recursion in "Admins can view all profiles"
-- Run this ONCE in Supabase SQL Editor if you already ran schema.sql
-- =============================================

-- 1) Add helper function (bypasses RLS when checking admin role)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2) Replace the recursive policy with one that uses the function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

-- 3) Update all other admin policies to use is_admin() (avoids future recursion on other tables)
DROP POLICY IF EXISTS "Admins can insert courses" ON public.courses;
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update courses" ON public.courses;
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert course images" ON public.course_images;
CREATE POLICY "Admins can insert course images" ON public.course_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update course images" ON public.course_images;
CREATE POLICY "Admins can update course images" ON public.course_images FOR UPDATE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete course images" ON public.course_images;
CREATE POLICY "Admins can delete course images" ON public.course_images FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update payments" ON public.payments;
CREATE POLICY "Admins can update payments" ON public.payments FOR UPDATE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all access" ON public.user_course_access;
CREATE POLICY "Admins can view all access" ON public.user_course_access FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can grant access" ON public.user_course_access;
CREATE POLICY "Admins can grant access" ON public.user_course_access FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can revoke access" ON public.user_course_access;
CREATE POLICY "Admins can revoke access" ON public.user_course_access FOR DELETE TO authenticated USING (public.is_admin());
