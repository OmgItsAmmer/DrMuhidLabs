  'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CourseWithDetails, CourseWithImages } from '@/lib/types'

export async function getCourses(): Promise<{ error?: string; courses: CourseWithImages[] }> {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      *,
      course_images (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching courses:', error)
    return { error: error.message, courses: [] }
  }

  return { courses: (courses as any) || [] }
}

export async function getCourse(id: string): Promise<{ error?: string; course: CourseWithDetails | null }> {
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      course_images (*),
      reviews (
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      ),
      uploaded_by_profile:profiles!uploaded_by (
        full_name
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return { error: error.message, course: null }
  }

  return { course: course as any as CourseWithDetails }
}

export async function createCourse(formData: {
  title: string
  description: string
  youtube_url: string
  thumbnail_url: string
  price: number
  images: string[]
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Create course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .insert({
      title: formData.title,
      description: formData.description,
      youtube_url: formData.youtube_url,
      thumbnail_url: formData.thumbnail_url,
      price: formData.price,
      uploaded_by: user.id,
    } as any)
    .select()
    .single()

  if (courseError) {
    console.error('Error creating course:', courseError)
    return { error: courseError.message }
  }

  // Add images
  if (formData.images.length > 0 && course) {
    const imageInserts = formData.images.map((url, index) => ({
      course_id: (course as any).id,
      image_url: url,
      sort_order: index,
    }))

    const { error: imagesError } = await supabase
      .from('course_images')
      .insert(imageInserts as any)

    if (imagesError) {
      console.error('Error adding course images:', imagesError)
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath('/dashboard')

  return { success: true, course }
}

export async function updateCourse(
  id: string,
  formData: {
    title: string
    description: string
    youtube_url: string
    thumbnail_url: string
    price: number
    images: string[]
  }
) {
  const supabase = await createClient()

  const { error: courseError } = await supabase
    .from('courses')
    .update({
      title: formData.title,
      description: formData.description,
      youtube_url: formData.youtube_url,
      thumbnail_url: formData.thumbnail_url,
      price: formData.price,
    } as any)
    .eq('id', id)

  if (courseError) {
    console.error('Error updating course:', courseError)
    return { error: courseError.message }
  }

  // Delete old images and add new ones
  await supabase.from('course_images').delete().eq('course_id', id)

  if (formData.images.length > 0) {
    const imageInserts = formData.images.map((url, index) => ({
      course_id: id,
      image_url: url,
      sort_order: index,
    }))

    await supabase.from('course_images').insert(imageInserts as any)
  }

  revalidatePath('/admin/courses')
  revalidatePath('/dashboard')
  revalidatePath(`/courses/${id}`)

  return { success: true }
}

export async function deleteCourse(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('courses').delete().eq('id', id)

  if (error) {
    console.error('Error deleting course:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/courses')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function getMyCourses() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', courses: [] }
  }

  const { data: courses, error } = await supabase
    .from('user_course_access')
    .select(`
      *,
      courses (
        *,
        course_images (*)
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching my courses:', error)
    return { error: error.message, courses: [] }
  }

  return { courses: courses?.map((item) => item.courses) || [] }
}

export async function hasAccess(courseId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from('user_course_access')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  return !!data
}
