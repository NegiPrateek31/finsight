import { GetServerSideProps } from 'next'
import prisma from '../../lib/prisma'

export default function Profile({ profile }: any) {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{profile?.user?.name}</h1>
      <p className="text-gray-600">{profile?.headline}</p>
      <div className="mt-4">{profile?.bio}</div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string
  const profile = await prisma.profile.findUnique({ where: { userId: id }, include: { user: true } })
  return { props: { profile } }
}
