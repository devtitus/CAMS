'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const TimeSlotSchema = z.object({
  subjectMappingId: z.string().min(1, 'Subject is required'),
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  roomNumber: z.string().optional(),
}).refine(data => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"]
})

export async function getTimeTable(sectionId: string) {
  try {
    const slots = await prisma.timeTable.findMany({
      where: {
        subjectMapping: {
          sectionId: sectionId
        }
      },
      include: {
        subjectMapping: {
          include: {
            subject: true,
            teacher: true
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })
    return { success: true, data: slots }
  } catch (error) {
    return { success: false, error: 'Failed to fetch timetable' }
  }
}

export async function createTimeSlot(data: z.infer<typeof TimeSlotSchema>) {
  const result = TimeSlotSchema.safeParse(data)
  
  if (!result.success) {
    return { success: false, error: result.error.format() }
  }

  const { subjectMappingId, dayOfWeek, startTime, endTime, roomNumber } = result.data

  try {
    // 1. Get Subject Mapping details to know Teacher and Section
    const mapping = await prisma.subjectMapping.findUnique({
        where: { id: subjectMappingId },
        include: { section: true, teacher: true } // Need IDs primarily
    })

    if (!mapping) {
        return { success: false, error: 'Invalid Subject Assignment' }
    }

    const { sectionId, teacherId } = mapping

    // 2. Check for SECTION Conflict
    // Is this SECTION busy at this time?
    const sectionConflict = await prisma.timeTable.findFirst({
        where: {
            subjectMapping: { sectionId: sectionId },
            dayOfWeek: dayOfWeek,
            OR: [
                { // Starts during existing slot
                    startTime: { lte: startTime },
                    endTime: { gt: startTime }
                },
                { // Ends during existing slot
                    startTime: { lt: endTime },
                    endTime: { gte: endTime }
                },
                { // Encloses existing slot
                    startTime: { gte: startTime },
                    endTime: { lte: endTime }
                }
            ]
        }
    })

    if (sectionConflict) {
        return { success: false, error: 'This section already has a class scheduled at this time.' }
    }

    // 3. Check for TEACHER Conflict
    // Is this TEACHER busy at this time (in ANY section)?
    const teacherConflict = await prisma.timeTable.findFirst({
        where: {
            subjectMapping: { teacherId: teacherId },
            dayOfWeek: dayOfWeek,
            OR: [
                { startTime: { lte: startTime }, endTime: { gt: startTime } },
                { startTime: { lt: endTime }, endTime: { gte: endTime } },
                { startTime: { gte: startTime }, endTime: { lte: endTime } }
            ]
        }
    })

    if (teacherConflict) {
        return { success: false, error: `Teacher ${mapping.teacher.name} is already teaching elsewhere at this time.` }
    }

    // 4. Create Slot
    await prisma.timeTable.create({
        data: {
            subjectMappingId,
            dayOfWeek,
            startTime,
            endTime,
            roomNumber
        }
    })

    revalidatePath('/admin/timetable')
    return { success: true }

  } catch (error) {
    console.error('Create Slot Error:', error)
    return { success: false, error: 'Failed to create time slot' }
  }
}

export async function deleteTimeSlot(id: string) {
    try {
        await prisma.timeTable.delete({ where: { id } })
        revalidatePath('/admin/timetable')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete slot' }
    }
}
