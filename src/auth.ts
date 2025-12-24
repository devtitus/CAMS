import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const { 
  handlers: { GET, POST }, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email?: string, password?: string }

        if (!email || !password) return null

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) return null

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

        if (passwordsMatch) {
          const { passwordHash: _, ...userWithoutPassword } = user
          return userWithoutPassword
        }

        return null
      },
    }),
  ],
})
