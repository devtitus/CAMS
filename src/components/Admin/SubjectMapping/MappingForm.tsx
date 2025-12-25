'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createMapping } from '@/app/actions/subject-mapping-actions'
import styles from '@/styles/admin/subject-form.module.css' // Reusing form styles

const MappingSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
})

type MappingFormProps = {
  sectionId: string
  subjects: any[]
  teachers: any[]
  onClose: () => void
  onSuccess: () => void
}

export default function MappingForm({ sectionId, subjects, teachers, onClose, onSuccess }: MappingFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(MappingSchema)
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await createMapping({
        ...data,
        sectionId
      })

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
        <h2 className={styles.title}>Assign Subject</h2>
        
        {error && <div className={styles.errorInfo}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
           <div className={styles.formGroup}>
             <label className={styles.label}>Subject</label>
             <select 
               {...register('subjectId')} 
               className={styles.select}
             >
               <option value="">Select Subject</option>
               {subjects.map(s => (
                 <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
               ))}
             </select>
             {errors.subjectId && <p className={styles.errorMsg}>{errors.subjectId.message as string}</p>}
           </div>

           <div className={styles.formGroup}>
             <label className={styles.label}>Teacher</label>
             <select 
               {...register('teacherId')} 
               className={styles.select}
             >
               <option value="">Select Teacher</option>
               {teachers.map(t => (
                 <option key={t.id} value={t.id}>{t.name}</option>
               ))}
             </select>
             {errors.teacherId && <p className={styles.errorMsg}>{errors.teacherId.message as string}</p>}
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
              {loading ? 'Assign' : 'Assign Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
