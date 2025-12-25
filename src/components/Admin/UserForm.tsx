'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createUser, updateUser } from '@/app/actions/user-actions'
import { UserRole } from '@prisma/client'
import styles from '@/styles/admin/user-form.module.css'

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  role: z.nativeEnum(UserRole),
  departmentId: z.string().optional(),
  batchId: z.string().optional(),
  sectionId: z.string().optional(),
  rollNumber: z.string().optional(),
})

type UserFormProps = {
  user?: any 
  onClose: () => void
  onSuccess: () => void
  departments: any[]
  batches: any[]
  sections: any[]
}

export default function UserForm({ user, onClose, onSuccess, departments = [], batches = [], sections = [] }: UserFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: user ? {
        ...user,
        password: '',
        departmentId: user.departmentId || '',
        batchId: user.batchId || '',
        sectionId: user.sectionId || '',
        rollNumber: user.rollNumber || ''
    } : {
      role: 'STUDENT',
      departmentId: '', 
      batchId: '', 
      sectionId: '',
      rollNumber: ''
    }
  })

  const role = watch('role')

  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    setLoading(true)
    setError(null)
    
    if (!data.departmentId || data.departmentId === '') delete data.departmentId
    if (!data.batchId || data.batchId === '') delete data.batchId
    if (!data.sectionId || data.sectionId === '') delete data.sectionId
    if (!data.rollNumber) delete data.rollNumber

    try {
      let result
      if (user) {
        result = await updateUser(user.id, data)
      } else {
        result = await createUser(data)
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
        <h2 className={styles.title}>{user ? 'Edit User' : 'Create New User'}</h2>
        
        {error && <div className={styles.errorInfo}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input 
              {...register('name')} 
              className={styles.input} 
            />
            {errors.name && <p className={styles.errorMsg}>{errors.name.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input 
              {...register('email')} 
              type="email" 
              className={styles.input} 
            />
             {errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password {user && '(Leave blank to keep current)'}</label>
            <input 
              {...register('password')} 
              type="password" 
              className={styles.input} 
            />
             {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Role</label>
            <select 
              {...register('role')} 
              className={styles.select}
            >
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          {role === 'STUDENT' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Roll Number</label>
                <input 
                  {...register('rollNumber')} 
                  className={styles.input} 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Batch</label>
                <select
                  {...register('batchId')}
                  className={styles.select}
                >
                  <option value="">Select Batch</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.course.code} ({b.startYear}-{b.endYear})</option>
                  ))}
                </select>
                 {errors.batchId && <p className={styles.errorMsg}>{errors.batchId.message}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Section</label>
                <select
                  {...register('sectionId')}
                  className={styles.select}
                >
                  <option value="">Select Section</option>
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Sem {s.semester.semesterNumber})</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {role === 'TEACHER' && (
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
          )}

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
              {loading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
