import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Allow larger body for course payloads (e.g. many image URLs or large descriptions)
export const maxDuration = 60

type CreateBody = {
  title: string
  description: string
  youtube_url: string
  thumbnail_url: string
  price: number
  images: string[]
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBody

    const {
      title,
      description,
      youtube_url,
      thumbnail_url,
      price,
      images = [],
    } = body

    if (!title || !youtube_url) {
      return NextResponse.json(
        { error: 'Title and YouTube URL are required' },
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

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title,
        description: description || null,
        youtube_url,
        thumbnail_url: thumbnail_url || null,
        price: price ?? 0,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (courseError) {
      console.error('Error creating course:', courseError)
      return NextResponse.json({ error: courseError.message }, { status: 500 })
    }

    const imageUrls = Array.isArray(images) ? images.filter((u) => u && String(u).trim()) : []
    if (imageUrls.length > 0 && course) {
      const imageInserts = imageUrls.map((url, index) => ({
        course_id: (course as { id: string }).id,
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

    return NextResponse.json({ success: true, course })
  } catch (err) {
    console.error('POST /api/admin/courses:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
