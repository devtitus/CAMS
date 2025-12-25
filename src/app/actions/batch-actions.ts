'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const BatchSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  startYear: z.coerce.number().min(2000, 'Invalid year').max(2100, 'Invalid year'),
  endYear: z.coerce.number().min(2000, 'Invalid year').max(2100, 'Invalid year'),
}).refine(data => data.endYear > data.startYear, {
  message: "End year must be after start year",
  path: ["endYear"]
})

export async function getBatches() {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { startYear: 'desc' },
      include: {
        course: true,
        _count: {
            select: { 
                semesters: true,
                users: true
            }
        }
      }
    })
    return { success: true, data: batches }
  } catch (error) {
    return { success: false, error: 'Failed to fetch batches' }
  }
}

export async function createBatch(data: z.infer<typeof BatchSchema>) {
  const result = BatchSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.format() }
  }

  try {
    // Check for duplicate batch for same course
    const existing = await prisma.batch.findFirst({
        where: { 
            courseId: result.data.courseId,
            startYear: result.data.startYear,
            endYear: result.data.endYear
        }
    })

    if (existing) {
        return { success: false, error: 'Batch already exists for this course' }
    }

    await prisma.batch.create({
      data: result.data
    })
    revalidatePath('/admin/batches')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateBatch(id: string, data: z.infer<typeof BatchSchema>) {
    const result = BatchSchema.safeParse(data)
    if (!result.success) {
      return { success: false, error: result.error.format() }
    }
  
    try {
      // Check for duplicate (exclude current)
      const existing = await prisma.batch.findFirst({
          where: { 
              courseId: result.data.courseId,
              startYear: result.data.startYear,
              endYear: result.data.endYear,
              NOT: { id }
          }
      })
  
      if (existing) {
          return { success: false, error: 'Batch already exists for this course' }
      }
  
      await prisma.batch.update({
        where: { id },
        data: result.data
      })
      revalidatePath('/admin/batches')
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
}

export async function deleteBatch(id: string) {
  try {
    await prisma.batch.delete({
      where: { id }
    })
    revalidatePath('/admin/batches')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to delete batch. It might have related users or semesters.' }
  }
}
