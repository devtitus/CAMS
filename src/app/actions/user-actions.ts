'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.nativeEnum(UserRole),
  // Optional fields based on role
  departmentId: z.string().optional(),
  batchId: z.string().optional(),
  sectionId: z.string().optional(),
  rollNumber: z.string().optional(),
})

export async function createUser(data: z.infer<typeof UserSchema>) {
  const result = UserSchema.safeParse(data)

  if (!result.success) {
    return { success: false, error: result.error.format() }
  }

  const { name, email, password, role, departmentId, batchId, sectionId, rollNumber } = result.data

  if (!password) {
    return { success: false, error: 'Password is required for new users' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
        departmentId: departmentId || null,
        batchId: batchId || null,
        sectionId: sectionId || null,
        rollNumber: rollNumber || null,
      },
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
        return { success: false, error: 'Email already exists' }
    }
    console.error('Failed to create user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function updateUser(id: string, data: z.infer<typeof UserSchema>) {
    const result = UserSchema.safeParse(data)

    if (!result.success) {
      return { success: false, error: result.error.format() }
    }
  
    const { name, email, password, role, departmentId, batchId, sectionId, rollNumber } = result.data
  
    try {
      const updateData: any = {
        name,
        email,
        role,
        departmentId: departmentId || null,
        batchId: batchId || null,
        sectionId: sectionId || null,
        rollNumber: rollNumber || null,
      }

      if (password) {
        updateData.passwordHash = await bcrypt.hash(password, 10)
      }
  
      await prisma.user.update({
        where: { id },
        data: updateData,
      })
  
      revalidatePath('/admin/users')
      return { success: true }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'Email already exists' }
        }
      console.error('Failed to update user:', error)
      return { success: false, error: 'Failed to update user' }
    }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

export async function getUsers(role?: UserRole, query?: string) {
    try {
        const where: any = {}
        if (role) {
            where.role = role
        }
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ]
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                department: true,
                batch: {
                    include: {
                        course: true
                    }
                },
                section: true
            }
        })
        return { success: true, data: users }
    } catch (error) {
        console.error("Failed to fetch users", error)
        return { success: false, error: "Failed to fetch users"}
    }
}
