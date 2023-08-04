import { useLocale } from 'next-intl'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'

import Session from '@/components/Session'

import '@/styles/globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'next-leaflet',
    description: 'An optimized tech stack for efficiency.'
}

const inter = Inter({ subsets: ['latin'] })
export default async function Layout({ children, params: { locale } }: { children: React.ReactNode, params: any }) {

    let messages
    try { messages = (await import(`../../src/locales/messages/${locale}.json`)).default }
    catch (_) { notFound() }
    if (locale !== (useLocale())) notFound()

    return (
        <html lang="en" className="h-full">
            <body className={inter.className + ' h-full'}>
                <Session>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        {children}
                    </NextIntlClientProvider>
                </Session>
            </body>
        </html>
    )
}
