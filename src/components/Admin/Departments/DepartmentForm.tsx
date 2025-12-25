'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createDepartment, updateDepartment } from '@/app/actions/department-actions'
import styles from '@/styles/admin/department-form.module.css'

const DepartmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required').toUpperCase(),
})

type DepartmentFormProps = {
  department?: any 
  onClose: () => void
  onSuccess: () => void
}

export default function DepartmentForm({ department, onClose, onSuccess }: DepartmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof DepartmentSchema>>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: department ? {
        name: department.name,
        code: department.code,
    } : {
      name: '',
      code: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof DepartmentSchema>) => {
    setLoading(true)
    setError(null)
    
    try {
      let result
      if (department) {
        result = await updateDepartment(department.id, data)
      } else {
        result = await createDepartment(data)
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
        <h2 className={styles.title}>{department ? 'Edit Department' : 'Create New Department'}</h2>
        
        {error && <div className={styles.errorInfo}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Department Name</label>
            <input 
              {...register('name')} 
              placeholder="e.g. Computer Science"
              className={styles.input} 
            />
            {errors.name && <p className={styles.errorMsg}>{errors.name.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Department Code</label>
            <input 
              {...register('code')} 
              placeholder="e.g. CSE"
              className={styles.input} 
            />
             {errors.code && <p className={styles.errorMsg}>{errors.code.message}</p>}
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
              {loading ? 'Saving...' : 'Save Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
