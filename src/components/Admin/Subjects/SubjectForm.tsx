'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSubject, updateSubject } from '@/app/actions/subject-actions'
import styles from '@/styles/admin/subject-form.module.css'

const SubjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  credits: z.coerce.number().min(0, 'Credits cannot be negative'),
  departmentId: z.string().min(1, 'Department is required')
})

type SubjectFormProps = {
  subject?: any 
  onClose: () => void
  onSuccess: () => void
  departments: any[]
}

export default function SubjectForm({ subject, onClose, onSuccess, departments = [] }: SubjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SubjectSchema),
    defaultValues: subject ? {
        name: subject.name,
        code: subject.code,
        credits: subject.credits,
        departmentId: subject.departmentId
    } : {
      name: '',
      code: '',
      credits: 3,
      departmentId: ''
    }
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    
    try {
      let result
      if (subject) {
        result = await updateSubject(subject.id, data)
      } else {
        result = await createSubject(data)
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
        <h2 className={styles.title}>{subject ? 'Edit Subject' : 'Create New Subject'}</h2>
        
        {error && <div className={styles.errorInfo}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
           <div className={styles.formGroup}>
             <label className={styles.label}>Department</label>
             <select 
               {...register('departmentId')} 
               className={styles.select}
             >
               <option value="">Select Department</option>
               {departments.map(d => (
                 <option key={d.id} value={d.id}>{d.name}</option>
               ))}
             </select>
             {errors.departmentId && <p className={styles.errorMsg}>{errors.departmentId.message as string}</p>}
           </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Subject Name</label>
            <input 
              {...register('name')} 
              className={styles.input} 
              placeholder="e.g. Data Structures"
            />
            {errors.name && <p className={styles.errorMsg}>{errors.name.message as string}</p>}
          </div>

          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.col}`}>
                <label className={styles.label}>Subject Code</label>
                <input 
                {...register('code')} 
                className={styles.input} 
                placeholder="e.g. CS101"
                />
                {errors.code && <p className={styles.errorMsg}>{errors.code.message as string}</p>}
            </div>

            <div className={`${styles.formGroup} ${styles.col}`}>
                <label className={styles.label}>Credits</label>
                <input 
                type="number"
                {...register('credits')} 
                className={styles.input} 
                />
                {errors.credits && <p className={styles.errorMsg}>{errors.credits.message as string}</p>}
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
              {loading ? 'Saving...' : 'Save Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
