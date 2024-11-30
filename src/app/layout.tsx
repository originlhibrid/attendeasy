import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NextAuthProvider } from '@/components/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AttendEasy',
  description: 'Track your attendance with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}