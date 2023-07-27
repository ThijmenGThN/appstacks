import prisma from '@/prisma/client'

import providers from './providers'

import type { Roles, User } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'

declare module 'next-auth/jwt' {
    interface JWT {
        name: string
        email: string
        role: Roles
    }
}

declare module "next-auth" {
    interface Session {
        user: User
    }
}

const options: NextAuthOptions = {
    providers,
    callbacks: {
        async jwt({ token }) {
            const { name, email, role } = await prisma.user.findUnique({ where: { email: token.email } }) as User

            return { name, email, role }
        },
        async session({ session, token }) {
            token.name && (session.user.name = token.name)
            token.role && (session.user.role = token.role)

            return session
        }
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
        error: '/login'
    }
}

export default options