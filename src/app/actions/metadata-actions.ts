'use server'

import prisma from '@/lib/prisma'

export async function getDepartments() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    })
    return { success: true, data: departments }
  } catch (error) {
    console.error('Failed to fetch departments:', error)
    return { success: false, error: 'Failed to fetch departments' }
  }
}

export async function getBatches() {
  try {
    const batches = await prisma.batch.findMany({
      include: { course: true },
      orderBy: { startYear: 'desc' }
    })
    return { success: true, data: batches }
  } catch (error) {
    console.error('Failed to fetch batches:', error)
    return { success: false, error: 'Failed to fetch batches' }
  }
}

export async function getSections() {
  try {
    const sections = await prisma.section.findMany({
      include: { semester: { include: { batch: { include: { course: true } } } } },
      orderBy: { name: 'asc' }
    })
    return { success: true, data: sections }
  } catch (error) {
    console.error('Failed to fetch sections:', error)
    return { success: false, error: 'Failed to fetch sections' }
  }
}
