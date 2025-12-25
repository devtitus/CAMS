'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import styles from './sidebar.module.css'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Departments', href: '/admin/departments', icon: '🏢' },
  { label: 'Courses', href: '/admin/courses', icon: '📚' },
  { label: 'Batches', href: '/admin/batches', icon: '🎓' },
  { label: 'Subjects', href: '/admin/subjects', icon: '📖' },
  { label: 'Subject Mapping', href: '/admin/subject-mapping', icon: '🔗' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Time-Table', href: '/admin/timetable', icon: '🗓️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className={styles.sidebar}>
      <Link href="/admin" className={styles.logo}>
        CAMS ADMIN
      </Link>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })} 
          className={styles.signOutBtn}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
