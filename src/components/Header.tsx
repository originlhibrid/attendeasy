'use client'

import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './auth/UserMenu'
import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white hover:opacity-90">
              AttendEasy
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
