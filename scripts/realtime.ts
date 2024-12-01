import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Subscribe to user changes
  const subscription = await prisma.$subscribe.user.onCreate({}).then(async (event) => {
    console.log('New user created:', event.data)
  })

  console.log('Listening for new user creations...')
  console.log('Open Prisma Studio and create a new user to see the event!')

  // Keep the script running
  await new Promise(() => {})
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
