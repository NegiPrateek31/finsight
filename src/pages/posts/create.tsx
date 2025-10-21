import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
// Use server upload endpoint to handle Cloudinary uploads

export default function CreatePost() {
  const sessionHook: any = useSession()
  const session = sessionHook?.data
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user?.id) return
    
    setUploading(true)
    try {
      let attachments: string[] = []
      if (file) {
        // Convert file to base64
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = error => reject(error)
        })

        const base64 = await toBase64(file)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64 }),
        })
        if (uploadRes.ok) {
          const json = await uploadRes.json()
          attachments = [json.url]
        }
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          authorId: session.user.id,
          attachments
        })
      })
      
      if (res.ok) {
        router.push('/feed')
      }
    } catch (err) {
      console.error(err)
    }
    setUploading(false)
  }

  if (!session) return <div>Please sign in</div>

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Attachment</label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {uploading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </main>
  )
}