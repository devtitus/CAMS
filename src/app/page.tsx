import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const role = session.user?.role

  if (role === 'ADMIN') {
    redirect('/admin')
  } else if (role === 'TEACHER') {
    redirect('/teacher')
  } else if (role === 'STUDENT') {
    redirect('/student')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#020617', color: '#fff' }}>
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <p>You don&apos;t have a dashboard assigned yet. Please contact the administrator.</p>
      </div>
    </div>
  )
}
