'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createTimeSlot } from '@/app/actions/timetable-actions'
import styles from '@/styles/admin/timetable.module.css'
import formStyles from '@/styles/admin/subject-form.module.css' // reusing some form styles

const SlotSchema = z.object({
  subjectMappingId: z.string().min(1, 'Subject is required'),
  dayOfWeek: z.coerce.number().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().min(1, 'End Time is required'),
  roomNumber: z.string().optional()
})

type TimeSlotModalProps = {
  mappings: any[] // Mapped subjects for this section
  onClose: () => void
  onSuccess: () => void
}

const DAYS = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
]

export default function TimeSlotModal({ mappings, onClose, onSuccess }: TimeSlotModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SlotSchema)
  })

  // Group mappings by subject for cleaner display
  // (Assuming one teacher per subject for now, but UI shows teacher name)
  
  const onSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    const result = await createTimeSlot(data)
    if (result.success) {
        onSuccess()
    } else {
        setError(typeof result.error === 'string' ? result.error : 'Validation failed')
    }
    setLoading(false)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={formStyles.title}>Add Schedule</h2>
        
        {error && <div className={formStyles.errorInfo}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Day and Times */}
            <div className="grid grid-cols-2 gap-4">
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Day</label>
                    <select {...register('dayOfWeek')} className={formStyles.select}>
                        {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Room (Optional)</label>
                    <input {...register('roomNumber')} className={formStyles.input} placeholder="e.g. 101" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Start Time</label>
                    <input type="time" {...register('startTime')} className={formStyles.input} />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>End Time</label>
                    <input type="time" {...register('endTime')} className={formStyles.input} />
                    {errors.endTime && <p className={formStyles.errorMsg}>{errors.endTime.message as string}</p>}
                </div>
            </div>

            {/* Subject Select */}
            <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Subject (Assigned Teacher)</label>
                <select {...register('subjectMappingId')} className={formStyles.select}>
                    <option value="">Select Subject</option>
                    {mappings.map(m => (
                        <option key={m.id} value={m.id}>
                            {m.subject.name} ({m.teacher.name})
                        </option>
                    ))}
                </select>
                {errors.subjectMappingId && <p className={formStyles.errorMsg}>{errors.subjectMappingId.message as string}</p>}
            </div>

            <div className={formStyles.actions}>
                <button type="button" onClick={onClose} className={formStyles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={loading} className={formStyles.submitBtn}>
                    {loading ? 'Saving...' : 'Save Slot'}
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
