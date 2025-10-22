'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface NavbarProps {
  user: {
    name?: string | null
    email?: string | null
    role: 'ADMIN' | 'USER'
  }
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Employee Directory
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                {user.role === 'ADMIN' ? 'Manage Employees' : 'My Profile'}
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/dashboard/users"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                  <p className="text-blue-600 text-xs font-semibold">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
