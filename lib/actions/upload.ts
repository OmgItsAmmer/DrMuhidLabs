'use server'

import { createClient } from '@/lib/supabase/server'

const BUCKET = 'course-images'
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export type UploadResult = { url: string; path: string } | { error: string }

export async function uploadCourseImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  if (!file || !(file instanceof File)) {
    return { error: 'No file provided' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: `Invalid type. Allowed: ${ALLOWED_TYPES.join(', ')}` }
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: 'File too large. Max 5MB.' }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error)
    return { error: error.message }
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: urlData.publicUrl, path }
}
