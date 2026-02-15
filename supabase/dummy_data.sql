-- =============================================
-- 1) DUMMY COURSES
-- =============================================

-- Three example courses (uploaded_by left NULL so no profile dependency)
INSERT INTO public.courses (title, description, youtube_url, thumbnail_url, price, uploaded_by)
VALUES
  (
    'ECG Interpretation Mastery',
    'Step‑by‑step ECG interpretation for medical students and residents.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.pexels.com/photos/4226127/pexels-photo-4226127.jpeg',
    49.00,
    NULL
  ),
  (
    'Clinical Pathology Essentials',
    'Core clinical pathology concepts with real‑world cases.',
    'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    'https://images.pexels.com/photos/5726801/pexels-photo-5726801.jpeg',
    39.00,
    NULL
  ),
  (
    'Radiology Crash Course',
    'Quick introduction to reading X‑rays and CT scans.',
    'https://www.youtube.com/watch?v=oUFJJNQGwhk',
    'https://images.pexels.com/photos/7089620/pexels-photo-7089620.jpeg',
    59.00,
    NULL
  );

-- =============================================
-- 2) DUMMY COURSE IMAGES
--    (uses course titles to look up IDs)
-- =============================================

INSERT INTO public.course_images (course_id, image_url, sort_order)
VALUES
  (
    (SELECT id FROM public.courses WHERE title = 'ECG Interpretation Mastery' LIMIT 1),
    'https://images.pexels.com/photos/4226128/pexels-photo-4226128.jpeg',
    0
  ),
  (
    (SELECT id FROM public.courses WHERE title = 'ECG Interpretation Mastery' LIMIT 1),
    'https://images.pexels.com/photos/4226221/pexels-photo-4226221.jpeg',
    1
  ),
  (
    (SELECT id FROM public.courses WHERE title = 'Clinical Pathology Essentials' LIMIT 1),
    'https://images.pexels.com/photos/5726800/pexels-photo-5726800.jpeg',
    0
  ),
  (
    (SELECT id FROM public.courses WHERE title = 'Radiology Crash Course' LIMIT 1),
    'https://images.pexels.com/photos/7089010/pexels-photo-7089010.jpeg',
    0
  );

-- =============================================
-- 3) OPTIONAL: DUMMY PAYMENTS + ACCESS + REVIEWS
--    Only inserts if you have at least one admin and one customer in public.profiles.
--    Uses first admin (role='admin') and first customer (role='customer') by role.
--    If you have no customers yet, sign in with a second Google account to get one.
-- =============================================

-- Payment (verified) – only if we have both a customer and an admin
INSERT INTO public.payments (user_id, course_id, transaction_id, status, verified_at, verified_by)
SELECT
  cust.id,
  (SELECT id FROM public.courses WHERE title = 'ECG Interpretation Mastery' LIMIT 1),
  'TXN-DEMO-123456',
  'verified',
  NOW(),
  adm.id
FROM (SELECT id FROM public.profiles WHERE role = 'customer' LIMIT 1) AS cust
CROSS JOIN (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1) AS adm
WHERE cust.id IS NOT NULL AND adm.id IS NOT NULL;

-- Grant access for that customer to that course
INSERT INTO public.user_course_access (user_id, course_id, granted_by)
SELECT
  cust.id,
  (SELECT id FROM public.courses WHERE title = 'ECG Interpretation Mastery' LIMIT 1),
  adm.id
FROM (SELECT id FROM public.profiles WHERE role = 'customer' LIMIT 1) AS cust
CROSS JOIN (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1) AS adm
WHERE cust.id IS NOT NULL AND adm.id IS NOT NULL
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Example review from that customer
INSERT INTO public.reviews (course_id, user_id, rating, comment)
SELECT
  (SELECT id FROM public.courses WHERE title = 'ECG Interpretation Mastery' LIMIT 1),
  cust.id,
  5,
  'Excellent explanations, very clear ECG workflow!'
FROM (SELECT id FROM public.profiles WHERE role = 'customer' LIMIT 1) AS cust
WHERE cust.id IS NOT NULL
ON CONFLICT (course_id, user_id) DO NOTHING;