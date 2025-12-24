import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#020617',
      color: '#fff',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#ef4444' }}>403</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Unauthorized Access</h2>
      <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>
        You do not have permission to access the requested page.
      </p>
      <Link 
        href="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
      >
        Return to Home
      </Link>
    </div>
  )
}
