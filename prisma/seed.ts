import 'dotenv/config'
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@cams.com'
  const adminPassword = 'adminpassword123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'System Administrator',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
    },
  })

  console.log({ admin })
  console.log('Seeding finished. Default admin created.')
  console.log(`Email: ${adminEmail}`)
  console.log(`Password: ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
