import React from 'react'

export default function PostCard({ post }: any) {
  return (
    <article className="p-4 border rounded">
      <h3 className="font-semibold">{post.title}</h3>
      <p className="text-sm text-gray-700">{post.content}</p>
    </article>
  )
}
