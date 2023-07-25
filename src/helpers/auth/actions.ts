"use server"

import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'

import prisma from '@/prisma/client'
import Email from '@/emails/client'

import eReset from '@/emails/Reset'

interface iUser {
    name: string
    email: string
    password: string
}

const vPassword = z.string().min(8, { message: 'This password is too short.' }).max(128, { message: 'This password is too long.' })

const vUser = z.object({
    name: z.string().min(2, { message: 'This name is too short.' }).max(32, { message: 'This name is too long.' }),
    email: z.string().min(2, { message: 'This email address is too short.' }).max(64, { message: 'This email address is too long.' }).email('This email address is not valid.'),
    password: vPassword
})

export async function resetRequest(email: string) {
    try {
        if (!process.env.NEXTAUTH_SECRET || !process.env.NEXTAUTH_URL) throw new Error('Missing NEXTAUTH environment variables.')

        const passwordResetToken = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, { expiresIn: '45m' })

        await prisma.user.update({
            where: { email },
            data: { passwordResetToken }
        })

        await Email(
            eReset({
                email,
                link: process.env.NEXTAUTH_URL + '/login/reset/' + passwordResetToken,
                assets: { logoUrl: process.env.NEXTAUTH_URL + '/logo.webp' }
            }),
            {
                to: email,
                subject: 'Reset your password'
            }
        )
    }
    catch (error) {
        console.log(error)
        redirect('/login')
    }
}

export async function resetUpdate({ password, token }: { password: string, token: string }) {
    try {
        if (!process.env.NEXTAUTH_SECRET) throw new Error('Missing NEXTAUTH environment variables.')

        vPassword.parse(password)

        const { email }: string | any = jwt.verify(token, process.env.NEXTAUTH_SECRET)

        const { passwordResetToken }: string | any = await prisma.user.findUnique({ where: { email } })

        if (token != passwordResetToken) throw new Error('The provided token is not valid.')

        await prisma.user.update({
            where: { email },
            data: {
                password: await bcrypt.hash(password, 12),
                passwordResetToken: null
            }
        })
    }
    catch (error) {
        console.log(error)
        redirect('/login')
    }
}

export async function register(user: iUser) {
    try {
        if (!process.env.NEXTAUTH_SECRET) throw new Error('Missing NEXTAUTH environment variables.')

        user = vUser.parse(user)
        await prisma.user.create({
            data: {
                ...user,
                emailVerifyToken: jwt.sign({ email: user.email }, process.env.NEXTAUTH_SECRET, { expiresIn: '45m' }),
                password: await bcrypt.hash(user.password, 12)
            }
        })
    }
    catch (error) {
        console.log(error)
        redirect('/register/exists?email=' + encodeURI(user.email))
    }
}