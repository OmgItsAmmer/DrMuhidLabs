'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitPayment(courseId: string, transactionId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if payment already exists
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .in('status', ['pending', 'verified'])
    .single()

  if (existing) {
    return { error: 'Payment already submitted for this course' }
  }

  const { error } = await supabase.from('payments').insert({
    user_id: user.id,
    course_id: courseId,
    transaction_id: transactionId,
    status: 'pending',
  })

  if (error) {
    console.error('Error submitting payment:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function getPendingPayments() {
  const supabase = await createClient()

  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      ),
      courses (
        title,
        thumbnail_url
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending payments:', error)
    return { error: error.message, payments: [] }
  }

  return { payments: payments || [] }
}

export async function verifyPayment(paymentId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get payment details
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single()

  if (paymentError) {
    console.error('Error fetching payment:', paymentError)
    return { error: paymentError.message }
  }

  // Update payment status
  const { error: updateError } = await supabase
    .from('payments')
    .update({
      status: 'verified',
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq('id', paymentId)

  if (updateError) {
    console.error('Error updating payment:', updateError)
    return { error: updateError.message }
  }

  // Grant access to course
  const { error: accessError } = await supabase
    .from('user_course_access')
    .insert({
      user_id: payment.user_id,
      course_id: payment.course_id,
      granted_by: user.id,
    })

  if (accessError) {
    console.error('Error granting access:', accessError)
    return { error: accessError.message }
  }

  revalidatePath('/admin/verify')

  return { success: true }
}

export async function rejectPayment(paymentId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('payments')
    .update({
      status: 'rejected',
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq('id', paymentId)

  if (error) {
    console.error('Error rejecting payment:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/verify')

  return { success: true }
}

export async function getMyPayments() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', payments: [] }
  }

  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      *,
      courses (
        title,
        thumbnail_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error)
    return { error: error.message, payments: [] }
  }

  return { payments: payments || [] }
}
