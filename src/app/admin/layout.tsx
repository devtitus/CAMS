import Sidebar from '@/components/Sidebar/Sidebar'
import styles from './admin-layout.module.css'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
