import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.time('First query')
  const firstQuery = await prisma.user.findMany({
    include: {
      subjects: true,
    },
  })
  console.timeEnd('First query')
  console.log('Users found:', firstQuery.length)

  // Second query should be faster due to caching
  console.time('Second query (cached)')
  const secondQuery = await prisma.user.findMany({
    include: {
      subjects: true,
    },
  })
  console.timeEnd('Second query (cached)')
  console.log('Users found:', secondQuery.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
