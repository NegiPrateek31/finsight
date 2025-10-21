/* eslint-disable no-unused-vars */

export async function uploadPlaceholder(file: File | Blob) {
  // Placeholder - integrate Cloudinary or S3 in production
  return {
    url: '/uploads/placeholder.pdf',
    filename: 'placeholder.pdf'
  }
}
