import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Finance',
      image: ''
    }
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Markets',
      image: ''
    }
  })

  await prisma.profile.create({
    data: {
      userId: alice.id,
      headline: 'Equity Research Analyst',
      bio: 'I write about macro trends and equities.'
    }
  })

  await prisma.post.createMany({
    data: [
      {
        authorId: alice.id,
        title: 'Q3 Earnings Summary',
        content: 'Key beats and misses this quarter...'
      },
      {
        authorId: bob.id,
        title: 'Market Outlook 2026',
        content: 'Why rates matter and what to watch.'
      }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
