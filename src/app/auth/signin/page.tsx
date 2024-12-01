'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'

export default function SignIn() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      router.push('/')
      router.refresh()
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setIsLoading(true)
      console.log('Attempting sign in with:', { email: formData.email })

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log('Sign in result:', result)

      if (!result) {
        throw new Error('No response from authentication server')
      }

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.ok) {
        console.log('Sign in successful, redirecting...')
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Sign-in error:', error)
      setError(error.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <AuthCard
      title="Sign In"
      subtitle="Welcome back!"
      footerText="Don't have an account?"
      footerLink="/auth/signup"
      footerLinkText="Sign up"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>
    </AuthCard>
  )
}
