'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBatch, updateBatch } from '@/app/actions/batch-actions'
import styles from '@/styles/admin/batch-form.module.css'

const BatchSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  startYear: z.coerce.number().min(2000, 'Invalid year').max(2100, 'Invalid year'),
  endYear: z.coerce.number().min(2000, 'Invalid year').max(2100, 'Invalid year'),
}).refine(data => data.endYear > data.startYear, {
  message: "End year must be after start year",
  path: ["endYear"]
})

type BatchFormProps = {
  batch?: any 
  onClose: () => void
  onSuccess: () => void
  courses: any[]
}

export default function BatchForm({ batch, onClose, onSuccess, courses = [] }: BatchFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof BatchSchema>>({
    resolver: zodResolver(BatchSchema),
    defaultValues: batch ? {
        courseId: batch.courseId,
        startYear: batch.startYear,
        endYear: batch.endYear,
    } : {
      courseId: '',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 4,
    }
  })

  const onSubmit = async (data: z.infer<typeof BatchSchema>) => {
    setLoading(true)
    setError(null)
    
    try {
      let result
      if (batch) {
        result = await updateBatch(batch.id, data)
      } else {
        result = await createBatch(data)
      }

      if (result.success) {
        onSuccess()
      } else {
        setError(typeof result.error === 'string' ? result.error : 'Validation failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{batch ? 'Edit Batch' : 'Create New Batch'}</h2>
        
        {error && <div className={styles.errorInfo}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
             <label className={styles.label}>Course</label>
             <select 
               {...register('courseId')} 
               className={styles.select}
             >
               <option value="">Select Course</option>
               {courses.map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
               ))}
             </select>
              {errors.courseId && <p className={styles.errorMsg}>{errors.courseId.message}</p>}
           </div>

           <div className={styles.row}>
              <div className={`${styles.formGroup} ${styles.col}`}>
                <label className={styles.label}>Start Year</label>
                <input 
                  type="number"
                  {...register('startYear')} 
                  className={styles.input} 
                />
                {errors.startYear && <p className={styles.errorMsg}>{errors.startYear.message}</p>}
              </div>

              <div className={`${styles.formGroup} ${styles.col}`}>
                <label className={styles.label}>End Year</label>
                <input 
                  type="number"
                  {...register('endYear')} 
                  className={styles.input} 
                />
                 {errors.endYear && <p className={styles.errorMsg}>{errors.endYear.message}</p>}
              </div>
           </div>

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? 'Saving...' : 'Save Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
