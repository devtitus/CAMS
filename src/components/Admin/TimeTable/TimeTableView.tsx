'use client'

import { TrashIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/timetable.module.css'
import { deleteTimeSlot } from '@/app/actions/timetable-actions'

type TimeTableViewProps = {
  slots: any[]
  onRefresh: () => void
}

const DAYS = [1, 2, 3, 4, 5, 6] // Mon-Sat
// 12 hours from 08:00 to 20:00
const START_HOUR = 8 
const HOURS = Array.from({ length: 12 }, (_, i) => START_HOUR + i) 

export default function TimeTableView({ slots, onRefresh }: TimeTableViewProps) {

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this slot?')) {
        await deleteTimeSlot(id)
        onRefresh()
    }
  }

  // Convert "HH:MM" to pixels from top
  // Assumption: 1 Hour = 60px
  const getPosition = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    const minutesFromStart = (h - START_HOUR) * 60 + m
    return Math.max(0, minutesFromStart) // 1 min = 1px for simplicity
  }
  
  const getHeight = (start: string, end: string) => {
    return getPosition(end) - getPosition(start)
  }

  // Generate colors based on subject code (simple hash)
  const getColor = (code: string) => {
    const colors = [
        { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' }, // Blue
        { bg: '#dcfce7', border: '#22c55e', text: '#166534' }, // Green
        { bg: '#fef9c3', border: '#eab308', text: '#854d0e' }, // Yellow
        { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }, // Red
        { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8' }, // Purple
    ]
    const idx = code.length % colors.length
    return colors[idx]
  }

  return (
    <div className={styles.gridContainer}>
      {/* Header Row */}
      <div className={styles.headerCell}>Time</div>
      <div className={styles.headerCell}>Mon</div>
      <div className={styles.headerCell}>Tue</div>
      <div className={styles.headerCell}>Wed</div>
      <div className={styles.headerCell}>Thu</div>
      <div className={styles.headerCell}>Fri</div>
      <div className={styles.headerCell}>Sat</div>

      {/* Time Column */}
      <div className={styles.timeParams}>
        {HOURS.map(h => (
            <div key={h} className={styles.timeLabel}>
                {h}:00
            </div>
        ))}
      </div>

      {/* Days Columns */}
      {DAYS.map(day => (
        <div key={day} className={styles.dayColumn}>
            {/* Background Lines */}
            {HOURS.map(h => <div key={h} className={styles.gridLine} />)}

            {/* Slots */}
            {slots.filter(s => s.dayOfWeek === day).map(slot => {
                const top = getPosition(slot.startTime)
                const height = getHeight(slot.startTime, slot.endTime)
                const color = getColor(slot.subjectMapping.subject.code)

                return (
                    <div 
                        key={slot.id} 
                        className={styles.slotCard}
                        style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: color.bg,
                            borderLeftColor: color.border
                        }}
                    >
                        <div className={styles.subjectName} style={{ color: color.text }}>
                            {slot.subjectMapping.subject.name}
                        </div>
                        <div className={styles.teacherName}>
                            {slot.subjectMapping.teacher.name}
                        </div>
                        <div className="text-[10px] mt-1 text-gray-500">
                             {slot.startTime} - {slot.endTime}
                        </div>
                        {slot.roomNumber && <div className={styles.roomTag}>{slot.roomNumber}</div>}
                        
                        <button onClick={(e) => handleDelete(slot.id, e)} className={styles.deleteBtn}>
                            <TrashIcon className="w-3 h-3" />
                        </button>
                    </div>
                )
            })}
        </div>
      ))}
    </div>
  )
}
