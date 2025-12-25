'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const SubjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  credits: z.coerce.number().min(0, 'Credits cannot be negative'),
  departmentId: z.string().min(1, 'Department is required')
})

export async function getSubjects(departmentId?: string) {
  try {
    const where = departmentId ? { departmentId } : {}
    const subjects = await prisma.subject.findMany({
      where,
      orderBy: { code: 'asc' },
      include: {
        department: true
      }
    })
    return { success: true, data: subjects }
  } catch (error) {
    return { success: false, error: 'Failed to fetch subjects' }
  }
}

export async function createSubject(data: z.infer<typeof SubjectSchema>) {
  const result = SubjectSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.format() }
  }

  try {
    // Check for unique code
    const existing = await prisma.subject.findUnique({
      where: { code: result.data.code }
    })

    if (existing) {
      return { success: false, error: 'Subject code must be unique' }
    }

    await prisma.subject.create({
      data: result.data
    })

    revalidatePath('/admin/subjects')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to create subject' }
  }
}

export async function updateSubject(id: string, data: z.infer<typeof SubjectSchema>) {
  const result = SubjectSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.format() }
  }

  try {
    // Check for unique code (excluding current subject)
    const existing = await prisma.subject.findFirst({
      where: { 
        code: result.data.code,
        NOT: { id }
      }
    })

    if (existing) {
      return { success: false, error: 'Subject code must be unique' }
    }

    await prisma.subject.update({
      where: { id },
      data: result.data
    })

    revalidatePath('/admin/subjects')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to update subject' }
  }
}

export async function deleteSubject(id: string) {
  try {
    await prisma.subject.delete({
      where: { id }
    })
    revalidatePath('/admin/subjects')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to delete subject' }
  }
}
