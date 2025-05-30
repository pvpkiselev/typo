import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import MainNavigation from '@/components/MainNavigation'

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Typo App',
  description: 'For You to Enjoy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} antialiased`}>
        <div className="mx-auto max-w-5xl">
          <MainNavigation />
        </div>
        <main>{children}</main>
      </body>
    </html>
  )
}
