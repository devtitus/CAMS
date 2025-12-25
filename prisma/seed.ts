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

  // 1. Admin
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
  console.log('Admin seeded:', admin.email)

  // 2. Department
  const dept = await prisma.department.upsert({
    where: { code: 'CSE' },
    update: {},
    create: {
      name: 'Computer Science & Engineering',
      code: 'CSE'
    }
  })
  console.log('Department seeded:', dept.name)

  // 3. Course
  const course = await prisma.course.upsert({
    where: { code: 'B.Tech-CSE' },
    update: {},
    create: {
      name: 'B.Tech Computer Science',
      code: 'B.Tech-CSE',
      departmentId: dept.id
    }
  })

  // 4. Batch
  const batch = await prisma.batch.create({
    data: {
        courseId: course.id,
        startYear: 2024,
        endYear: 2028
    }
  })
  console.log('Batch seeded: 2024-2028')

  // 5. Semester
  const semester = await prisma.semester.create({
    data: {
        batchId: batch.id,
        semesterNumber: 1
    }
  })

  // 6. Section
  const section = await prisma.section.create({
    data: {
        semesterId: semester.id,
        name: 'A'
    }
  })
  console.log('Section seeded: A')

  // 7. Student
  const studentEmail = 'student@cams.com'
  const studentPassword = 'studentpassword123'
  const hashedStudentPassword = await bcrypt.hash(studentPassword, 10)

  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {
        batchId: batch.id,
        sectionId: section.id,
        rollNumber: 'CS24001'
    },
    create: {
      email: studentEmail,
      name: 'Student User',
      passwordHash: hashedStudentPassword,
      role: UserRole.STUDENT,
      batchId: batch.id,
      sectionId: section.id,
      rollNumber: 'CS24001'
    },
  })
  console.log('Student seeded:', student.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
