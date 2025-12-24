import 'dotenv/config'
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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

  const studentEmail = 'student@cams.com'
  const studentPassword = 'studentpassword123'
  const hashedStudentPassword = await bcrypt.hash(studentPassword, 10)

  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      email: studentEmail,
      name: 'Student User',
      passwordHash: hashedStudentPassword,
      role: UserRole.STUDENT,
    },
  })
  
  console.log({ student })
  console.log('Student user created.')
  console.log(`Email: ${studentEmail}`)
  console.log(`Password: ${studentPassword}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
