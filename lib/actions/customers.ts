'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCustomers(searchQuery?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
  }

  const { data: customers, error } = await query

  if (error) {
    console.error('Error fetching customers:', error)
    return { error: error.message, customers: [] }
  }

  return { customers: customers || [] }
}

export async function getCustomerDetails(customerId: string) {
  const supabase = await createClient()

  const { data: customer, error: customerError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', customerId)
    .single()

  if (customerError) {
    console.error('Error fetching customer:', customerError)
    return { error: customerError.message, customer: null, courses: [] }
  }

  // Get customer's purchased courses
  const { data: accessData, error: accessError } = await supabase
    .from('user_course_access')
    .select(`
      *,
      courses (
        *,
        course_images (*)
      )
    `)
    .eq('user_id', customerId)

  if (accessError) {
    console.error('Error fetching customer courses:', accessError)
  }

  const courses = accessData?.map((item) => item.courses) || []

  return { customer, courses }
}

export async function addReview(
  courseId: string,
  rating: number,
  comment: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user has access to the course
  const { data: access } = await supabase
    .from('user_course_access')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (!access) {
    return { error: 'You must have access to this course to leave a review' }
  }

  const { error } = await supabase.from('reviews').insert({
    course_id: courseId,
    user_id: user.id,
    rating,
    comment,
  })

  if (error) {
    // Check if review already exists
    if (error.code === '23505') {
      return { error: 'You have already reviewed this course' }
    }
    console.error('Error adding review:', error)
    return { error: error.message }
  }

  return { success: true }
}
