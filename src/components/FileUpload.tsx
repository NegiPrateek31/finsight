/* eslint-disable no-unused-vars */
import { useState, useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onError?: (error: string) => void
  accept?: Record<string, string[]>
  maxSize?: number
}

export default function FileUpload({ 
  onFileSelect,
  onError,
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg']
  },
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadProps) {
  const [preview, setPreview] = useState<string>()
  
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      onError?.(error.message)
      return
    }

    const file = acceptedFiles[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
      }
      onFileSelect(file)
    }
  }, [onFileSelect, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          // Next.js Image cannot handle Object URLs generated with URL.createObjectURL
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
        ) : (
          <p>Drag & drop a file here, or click to select</p>
        )}
      </div>
    </div>
  )
}