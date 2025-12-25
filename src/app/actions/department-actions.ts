'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const DepartmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required').transform(val => val.toUpperCase()),
})

export async function getDepartments() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
            select: { 
                courses: true,
                users: { where: { role: 'TEACHER' } }
            }
        }
      }
    })
    return { success: true, data: departments }
  } catch (error) {
    return { success: false, error: 'Failed to fetch departments' }
  }
}

export async function createDepartment(data: z.infer<typeof DepartmentSchema>) {
  const result = DepartmentSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.format() }
  }

  try {
    // Check for duplicate code
    const existing = await prisma.department.findUnique({
        where: { code: result.data.code }
    })

    if (existing) {
        return { success: false, error: 'Department code already exists' }
    }

    await prisma.department.create({
      data: result.data
    })
    revalidatePath('/admin/departments')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateDepartment(id: string, data: z.infer<typeof DepartmentSchema>) {
    const result = DepartmentSchema.safeParse(data)
    if (!result.success) {
      return { success: false, error: result.error.format() }
    }
  
    try {
      // Check for duplicate code (exclude current department)
      const existing = await prisma.department.findFirst({
          where: { 
              code: result.data.code,
              NOT: { id }
          }
      })
  
      if (existing) {
          return { success: false, error: 'Department code already exists' }
      }
  
      await prisma.department.update({
        where: { id },
        data: result.data
      })
      revalidatePath('/admin/departments')
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
}

export async function deleteDepartment(id: string) {
  try {
    await prisma.department.delete({
      where: { id }
    })
    revalidatePath('/admin/departments')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to delete department. It might have related courses or users.' }
  }
}
