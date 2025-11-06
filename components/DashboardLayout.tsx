'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Home, 
  Users, 
  Building2, 
  Calendar, 
  Settings, 
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  LogOut
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Departments', href: '/dashboard/departments', icon: Building2, adminOnly: true },
  { name: 'Holidays', href: '/dashboard/holidays', icon: Calendar },
  { name: 'Users', href: '/dashboard/users', icon: Settings, adminOnly: true },
  { name: 'My Profile', href: '/dashboard/profile', icon: User },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAdmin = session?.user?.role === 'ADMIN'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <div className="h-screen flex w-full">
      <div className="h-screen flex bg-gray-50 dark:bg-gray-900 w-full">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } bg-white dark:bg-gray-800 shadow-lg transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-all duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col`}
        >
          <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-lg">S</span>
              </div>
              {!sidebarCollapsed && (
                <div className="text-white text-xl font-bold">Socioh CMS</div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block text-white hover:bg-blue-500 p-1 rounded transition-colors"
            >
              <ChevronLeft
                className={`w-5 h-5 transform transition-transform ${
                  sidebarCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              if (item.adminOnly && !isAdmin) return null
              
              const isActive = pathname === item.href
              
              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <item.icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    {!sidebarCollapsed && (
                      <span className="transition-all duration-200">{item.name}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                  
                  {/* Tooltip for collapsed sidebar */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top header with user dropdown */}
        <div className="flex h-16 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 z-10">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Header content */}
          <div className="flex-1 flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white lg:hidden">Dashboard</h1>
            
            {/* Header actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Theme status indicator */}
              <div className="hidden lg:flex items-center text-xs text-gray-500 dark:text-gray-400 mr-2">
                {darkMode ? '🌙 Dark' : '☀️ Light'}
              </div>
              
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              
              {/* Notifications */}
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </div>
            
            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {session?.user?.image ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || ''}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session?.user?.role}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none transform opacity-100 scale-100 transition-all duration-200">
                  <div className="p-2">
                    {/* User info in dropdown */}
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session?.user?.email}
                      </p>
                    </div>
                    
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User className="mr-3 w-4 h-4" />
                      Edit Profile
                    </Link>
                    
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors lg:hidden"
                    >
                      {darkMode ? (
                        <Sun className="mr-3 w-4 h-4" />
                      ) : (
                        <Moon className="mr-3 w-4 h-4" />
                      )}
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <LogOut className="mr-3 w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 w-full">
          <div className="w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
    </div>
  )
}