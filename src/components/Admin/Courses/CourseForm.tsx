'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCourse, updateCourse } from '@/app/actions/course-actions'
import styles from '@/styles/admin/course-form.module.css'

const CourseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required').toUpperCase(),
  departmentId: z.string().min(1, 'Department is required'),
})

type CourseFormProps = {
  course?: any 
  onClose: () => void
  onSuccess: () => void
  departments: any[]
}

export default function CourseForm({ course, onClose, onSuccess, departments = [] }: CourseFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof CourseSchema>>({
    resolver: zodResolver(CourseSchema),
    defaultValues: course ? {
        name: course.name,
        code: course.code,
        departmentId: course.departmentId,
    } : {
      name: '',
      code: '',
      departmentId: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof CourseSchema>) => {
    setLoading(true)
    setError(null)
    
    try {
      let result
      if (course) {
        result = await updateCourse(course.id, data)
      } else {
        result = await createCourse(data)
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
        <h2 className={styles.title}>{course ? 'Edit Course' : 'Create New Course'}</h2>
        
        {error && <div className={styles.errorInfo}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Course Name</label>
            <input 
              {...register('name')} 
              placeholder="e.g. B.Tech Computer Science"
              className={styles.input} 
            />
            {errors.name && <p className={styles.errorMsg}>{errors.name.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Course Code</label>
            <input 
              {...register('code')} 
              placeholder="e.g. B.Tech-CSE"
              className={styles.input} 
            />
             {errors.code && <p className={styles.errorMsg}>{errors.code.message}</p>}
          </div>

          <div className={styles.formGroup}>
             <label className={styles.label}>Department</label>
             <select 
               {...register('departmentId')} 
               className={styles.select}
             >
               <option value="">Select Department</option>
               {departments.map(d => (
                 <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
               ))}
             </select>
              {errors.departmentId && <p className={styles.errorMsg}>{errors.departmentId.message}</p>}
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
              {loading ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
