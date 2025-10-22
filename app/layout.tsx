import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Employee Directory CMS',
  description: 'Manage your company employee directory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
