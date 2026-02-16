import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type UpdateBody = {
  title: string
  description: string
  youtube_url: string
  thumbnail_url: string
  price: number
  images: string[]
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as UpdateBody

    const {
      title,
      description,
      youtube_url,
      thumbnail_url,
      price,
      images = [],
    } = body

    if (!id || !title || !youtube_url) {
      return NextResponse.json(
        { error: 'Course id, title and YouTube URL are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: courseError } = await supabase
      .from('courses')
      .update({
        title,
        description: description || null,
        youtube_url,
        thumbnail_url: thumbnail_url || null,
        price: price ?? 0,
      })
      .eq('id', id)

    if (courseError) {
      console.error('Error updating course:', courseError)
      return NextResponse.json({ error: courseError.message }, { status: 500 })
    }

    await supabase.from('course_images').delete().eq('course_id', id)

    const imageUrls = Array.isArray(images) ? images.filter((u) => u && String(u).trim()) : []
    if (imageUrls.length > 0) {
      const imageInserts = imageUrls.map((url, index) => ({
        course_id: id,
        image_url: url,
        sort_order: index,
      }))

      const { error: imagesError } = await supabase.from('course_images').insert(imageInserts)

      if (imagesError) {
        console.error('Error adding course images:', imagesError)
      }
    }

    revalidatePath('/admin/courses')
    revalidatePath('/dashboard')
    revalidatePath(`/courses/${id}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/admin/courses/[id]:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
