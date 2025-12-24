import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnTeacher = nextUrl.pathname.startsWith('/teacher')
      const isOnStudent = nextUrl.pathname.startsWith('/student')

      if (isOnAdmin || isOnTeacher || isOnStudent) {
        if (isLoggedIn) {
          // Check role-based access
          const role = auth.user?.role
          if (isOnAdmin && role !== 'ADMIN') return Response.redirect(new URL('/unauthorized', nextUrl))
          if (isOnTeacher && role !== 'TEACHER' && role !== 'ADMIN') return Response.redirect(new URL('/unauthorized', nextUrl))
          if (isOnStudent && role !== 'STUDENT' && role !== 'ADMIN') return Response.redirect(new URL('/unauthorized', nextUrl))
          return true
        }
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id as string
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session
    },
  },
  providers: [], // Providers added in auth.ts
}
