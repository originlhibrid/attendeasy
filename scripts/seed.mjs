import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        subjects: {
          create: [
            {
              name: 'Mathematics',
              attended: 10,
              total: 15,
            },
            {
              name: 'Physics',
              attended: 8,
              total: 12,
            },
          ],
        },
      },
      include: {
        subjects: true,
      },
    })

    console.log('Created test user with subjects:', user)

    // Test querying the data
    const allUsers = await prisma.user.findMany({
      include: {
        subjects: true,
      },
    })

    console.log('All users with their subjects:', allUsers)
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
