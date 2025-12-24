'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import styles from './login.module.css'

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  )

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>CAMS</h1>
        <p className={styles.subtitle}>College Academic Management System</p>
        
        <form action={dispatch} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              className={styles.input}
              id="email"
              type="email"
              name="email"
              placeholder="admin@cams.com"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              className={styles.input}
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Sign In'}
          </button>
          
          {errorMessage && (
            <div className={styles.error} aria-live="polite">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
