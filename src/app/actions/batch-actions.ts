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

export async function getBatchById(id: string) {
    try {
        const batch = await prisma.batch.findUnique({
            where: { id },
            include: {
                course: true,
                semesters: {
                    orderBy: { semesterNumber: 'asc' },
                    include: {
                        sections: {
                            orderBy: { name: 'asc' },
                            include: {
                                _count: { select: { students: true } }
                            }
                        }
                    }
                }
            }
        })
        if (!batch) return { success: false, error: 'Batch not found' }
        return { success: true, data: batch }
    } catch (error) {
        return { success: false, error: 'Failed to fetch batch details' }
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

    // Transaction to create batch and auto-generate semesters
    await prisma.$transaction(async (tx) => {
        const batch = await tx.batch.create({
            data: result.data
        })

        const duration = result.data.endYear - result.data.startYear
        const totalSemesters = duration * 2
        
        const semestersData = Array.from({ length: totalSemesters }, (_, i) => ({
            batchId: batch.id,
            semesterNumber: i + 1
        }))

        await tx.semester.createMany({
            data: semestersData
        })
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
    return { success: false, error: 'Failed to delete batch.' }
  }
}

// Section Actions
export async function createSection(semesterId: string, name: string) {
    if (!name || name.trim() === '') {
        return { success: false, error: 'Section name is required' }
    }

    try {
        await prisma.section.create({
            data: {
                semesterId,
                name: name.trim()
            }
        })
        revalidatePath('/admin/batches/[id]', 'page')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to create section' }
    }
}

export async function deleteSection(sectionId: string) {
    try {
        await prisma.section.delete({
            where: { id: sectionId }
        })
        revalidatePath('/admin/batches/[id]', 'page')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete section' }
    }
}
