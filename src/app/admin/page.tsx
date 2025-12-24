import prisma from '@/lib/prisma'
import styles from './admin-layout.module.css'

export default async function AdminDashboard() {
  const stats = [
    { label: 'Total Students', value: await prisma.user.count({ where: { role: 'STUDENT' } }), icon: '🎓' },
    { label: 'Total Teachers', value: await prisma.user.count({ where: { role: 'TEACHER' } }), icon: '👨‍🏫' },
    { label: 'Departments', value: await prisma.department.count(), icon: '🏢' },
    { label: 'Batches', value: await prisma.batch.count(), icon: '📦' },
  ]

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>System Overview</h1>
      </header>

      <div className={styles.cardGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.card}>
            <div className={styles.cardTitle}>{stat.icon} {stat.label}</div>
            <div className={styles.cardValue}>{stat.value}</div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', padding: '24px', background: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Welcome to CAMS Admin</h2>
        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
          Use the sidebar to manage your college academic structure. You can start by creating Departments, then Courses, and assigning Subjects to your faculty.
        </p>
      </div>
    </div>
  )
}
