import { GetServerSideProps } from 'next'
import prisma from '../lib/prisma'

export default function Feed({ posts }: any) {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Feed</h1>
      <ul className="mt-6 space-y-6">
        {posts.map((p: any) => (
          <li key={p.id} className="p-4 border rounded">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-700">{p.content}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany({ take: 20, orderBy: { createdAt: 'desc' } })
  return { props: { posts } }
}
