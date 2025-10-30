import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'Socioh CRM',
  description: 'Manage your company employee directory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://cdn.prod.website-files.com/5f32467af6c27b4300272729/61f2481dd6560ec5dc062678_Emblem.svg" type="image/svg+xml" />
      </head>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
