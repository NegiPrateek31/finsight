// negiprateek31/finsight/finsight-1382f5b01244365c9a92f06365cf1e52dc019117/src/pages/posts/create.tsx
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import FileUpload from '@/components/FileUpload' // Assuming alias is configured
// Use server upload endpoint to handle Cloudinary uploads

export default function CreatePost() {
  const sessionHook: any = useSession()
  const session = sessionHook?.data
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  // FIX: Added state for user-facing errors
  const [error, setError] = useState<string>('')

  // Helper to convert file to base64
  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user?.id) return
    setError('')
    
    setUploading(true)
    try {
      let attachments: string[] = []
      if (file) {
        // Convert file to base64 for upload
        const base64 = await toBase64(file)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64 }),
        })

        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) {
          setError(uploadJson.error || 'File upload failed.')
          setUploading(false)
          return
        }
        attachments = [uploadJson.url]
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
      } else {
        const postJson = await res.json()
        setError(postJson.message || 'Failed to create post.')
      }
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred.')
    }
    setUploading(false)
  }

  // Handlers for FileUpload component
  const handleFileSelect = (newFile: File) => {
    setFile(newFile)
    setError('')
  }
  
  const handleFileError = (message: string) => {
    setFile(null)
    setError(message)
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
          {/* FIX: Using dedicated component for better UX and basic client-side validation */}
          <FileUpload 
            onFileSelect={handleFileSelect}
            onError={handleFileError}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>
          )}
        </div>

        {/* FIX: Display user-facing error message */}
        {error && (
          <div className="p-3 text-red-700 bg-red-100 border border-red-200 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !title || !content}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {uploading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </main>
  )
}