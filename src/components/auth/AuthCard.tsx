'use client'

import Link from 'next/link'

interface AuthCardProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  footerText?: string
  footerLink?: string
  footerLinkText?: string
  error?: string | null
  onSubmit?: (e: React.FormEvent) => void
  isLoading?: boolean
}

export function AuthCard({ 
  children, 
  title, 
  subtitle,
  footerText,
  footerLink,
  footerLinkText,
  error,
  onSubmit,
  isLoading 
}: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={onSubmit} className="space-y-6">
            {children}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : title}
              </button>
            </div>

            {footerText && footerLink && footerLinkText && (
              <div className="text-sm text-center mt-4">
                <span className="text-gray-500">{footerText}</span>{' '}
                <Link 
                  href={footerLink}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {footerLinkText}
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
