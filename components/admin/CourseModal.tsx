'use client'

import { useState, useRef } from 'react'
import { uploadCourseImage } from '@/lib/actions/upload'
import type { Course } from '@/lib/types'

interface CourseModalProps {
  course: (Course & { course_images?: any[] }) | null
  onClose: () => void
}

const inputClass =
  'mt-1 block w-full rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'
const labelClass = 'block text-sm font-medium text-slate-300'

export default function CourseModal({ course, onClose }: CourseModalProps) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    youtube_url: course?.youtube_url || '',
    thumbnail_url: course?.thumbnail_url || '',
    price: course?.price?.toString() || '',
    images: course?.course_images?.map((img) => img.image_url) || [''],
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  function handleImageChange(index: number, value: string) {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  function addImageField() {
    setFormData({ ...formData, images: [...formData.images, ''] })
  }

  function removeImageField(index: number) {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.set('file', file)
    const result = await uploadCourseImage(fd)
    setUploading(false)
    e.target.value = ''
    if ('error' in result) {
      setError(result.error)
      return
    }
    setFormData((prev) => ({ ...prev, thumbnail_url: result.url }))
  }

  async function handleAdditionalImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.set('file', file)
    const result = await uploadCourseImage(fd)
    setUploading(false)
    e.target.value = ''
    if ('error' in result) {
      setError(result.error)
      return
    }
    setFormData((prev) => ({ ...prev, images: [...prev.images, result.url] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const images = formData.images.filter((img) => img.trim() !== '')

    const data = {
      title: formData.title,
      description: formData.description,
      youtube_url: formData.youtube_url,
      thumbnail_url: formData.thumbnail_url,
      price: parseFloat(formData.price) || 0,
      images,
    }

    const url = course
      ? `/api/admin/courses/${course.id}`
      : '/api/admin/courses'
    const method = course ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const result = await res.json().catch(() => ({ error: 'Request failed' }))

    if (!res.ok || result.error) {
      setError(result.error || `Error ${res.status}`)
      setLoading(false)
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="relative z-10 inline-block w-full transform overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-semibold text-white">
                {course ? 'Edit Course' : 'Add New Course'}
              </h3>

              <div className="mt-6 space-y-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>YouTube URL</label>
                  <input
                    type="url"
                    required
                    value={formData.youtube_url}
                    onChange={(e) =>
                      setFormData({ ...formData, youtube_url: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Thumbnail</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="file"
                      ref={thumbnailInputRef}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-teal-500/50 hover:bg-slate-700 hover:text-teal-400 disabled:opacity-50"
                    >
                      {uploading ? 'Uploading…' : 'Upload image'}
                    </button>
                    <input
                      type="url"
                      value={formData.thumbnail_url}
                      onChange={(e) =>
                        setFormData({ ...formData, thumbnail_url: e.target.value })
                      }
                      placeholder="Or paste thumbnail URL"
                      className={`block flex-1 ${inputClass}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Additional Images</label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="mt-2 flex gap-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="Image URL or upload below"
                        className={inputClass}
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="rounded-xl bg-red-500/20 px-3 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/30 hover:bg-red-500/30"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="mt-2 flex gap-2">
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleAdditionalImageUpload}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => imageInputRef.current?.click()}
                      className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-teal-500/50 hover:text-teal-400 disabled:opacity-50"
                    >
                      {uploading ? 'Uploading…' : 'Upload image'}
                    </button>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-teal-500/50 hover:text-teal-400"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-700/50 bg-slate-800/30 px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
