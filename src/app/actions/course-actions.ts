'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const CourseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required').toUpperCase(),
  departmentId: z.string().min(1, 'Department is required'),
})

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { name: 'asc' },
      include: {
        department: true,
        _count: {
            select: { 
                batches: true 
            }
        }
      }
    })
    return { success: true, data: courses }
  } catch (error) {
    return { success: false, error: 'Failed to fetch courses' }
  }
}

export async function createCourse(data: z.infer<typeof CourseSchema>) {
  const result = CourseSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.format() }
  }

  try {
    // Check for duplicate code
    const existing = await prisma.course.findUnique({
        where: { code: result.data.code }
    })

    if (existing) {
        return { success: false, error: 'Course code already exists' }
    }

    await prisma.course.create({
      data: result.data
    })
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateCourse(id: string, data: z.infer<typeof CourseSchema>) {
    const result = CourseSchema.safeParse(data)
    if (!result.success) {
      return { success: false, error: result.error.format() }
    }
  
    try {
      // Check for duplicate code (exclude current course)
      const existing = await prisma.course.findFirst({
          where: { 
              code: result.data.code,
              NOT: { id }
          }
      })
  
      if (existing) {
          return { success: false, error: 'Course code already exists' }
      }
  
      await prisma.course.update({
        where: { id },
        data: result.data
      })
      revalidatePath('/admin/courses')
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.delete({
      where: { id }
    })
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to delete course. It might have related batches.' }
  }
}
