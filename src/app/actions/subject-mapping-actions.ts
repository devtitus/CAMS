'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const MappingSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  sectionId: z.string().min(1, 'Section is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
})

export async function getMappings(sectionId: string) {
  try {
    const mappings = await prisma.subjectMapping.findMany({
      where: { sectionId },
      include: {
        subject: true,
        teacher: true
      },
      orderBy: { subject: { name: 'asc' } }
    })
    return { success: true, data: mappings }
  } catch (error) {
    return { success: false, error: 'Failed to fetch mappings' }
  }
}

export async function createMapping(data: z.infer<typeof MappingSchema>) {
  const result = MappingSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.format() }
  }

  try {
    // Check if subject already assigned to this section
    const existing = await prisma.subjectMapping.findFirst({
      where: {
        sectionId: result.data.sectionId,
        subjectId: result.data.subjectId
      }
    })

    if (existing) {
      return { success: false, error: 'Subject is already assigned to this section' }
    }

    await prisma.subjectMapping.create({
      data: {
        subjectId: result.data.subjectId,
        sectionId: result.data.sectionId,
        teacherId: result.data.teacherId
      }
    })

    revalidatePath('/admin/subject-mapping')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to create assignment' }
  }
}

export async function deleteMapping(id: string) {
  try {
    await prisma.subjectMapping.delete({
      where: { id }
    })
    revalidatePath('/admin/subject-mapping')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to delete assignment' }
  }
}

// Fetch Hierarchy for Dropdowns
export async function getHierarchy() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                batches: {
                    include: {
                        semesters: {
                            orderBy: { semesterNumber: 'asc' },
                            include: {
                                sections: {
                                    orderBy: { name: 'asc' }
                                }
                            }
                        }
                    }
                }
            }
        })
        return { success: true, data: courses }
    } catch (error) {
        return { success: false, error: 'Failed to fetch hierarchy' }
    }
}
