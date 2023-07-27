"use server"

import { getServerSession } from "next-auth"

import prisma from '@/prisma/client'
import options from "@/auth/options"

export async function account({ name }: { name: string }) {
    const session = await getServerSession(options)

    if (!session || !session?.user.email) throw new Error('Invalid session.')

    await prisma.user.update({
        where: { email: session?.user.email },
        data: { name }
    })
}
