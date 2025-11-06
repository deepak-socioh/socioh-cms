import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'

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
    <html lang="en" className="w-full h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://cdn.prod.website-files.com/5f32467af6c27b4300272729/61f2481dd6560ec5dc062678_Emblem.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    if (!theme) {
                      localStorage.setItem('theme', 'light');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="w-full h-full m-0 p-0">
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
