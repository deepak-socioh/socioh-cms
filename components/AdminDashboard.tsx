'use client'

import { useEffect, useState } from 'react'
import EmployeeForm from './EmployeeForm'
import EmployeeList from './EmployeeList'
import EmployeeGrid from './EmployeeGrid'

export interface Employee {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  dateOfBirth: string | null
  department: {
    id: string
    name: string
    description: string | null
  } | null
  position: string
  employeeId: string
  joinDate: string
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  emergencyContactRelation: string | null
  married?: boolean
  marriageAnniversary?: string | null
  user: {
    id: string
    name: string | null
    email: string
    role: 'ADMIN' | 'USER'
    image?: string | null
  }
}

interface AdminDashboardProps {
  readOnly?: boolean
}

export default function AdminDashboard({ readOnly = false }: AdminDashboardProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentView, setCurrentView] = useState('default')
  
  // Advanced filters
  const [selectedMarriedStatus, setSelectedMarriedStatus] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedJoiningYear, setSelectedJoiningYear] = useState('')
  
  // Predefined views configuration
  const predefinedViews = {
    default: {
      name: 'Default View',
      description: 'Standard employee information',
      columns: {
        employee: true,
        contact: true,
        department: true,
        position: true,
        joinDate: true,
        role: true,
        dateOfBirth: false,
        married: false,
        address: false,
        emergencyContact: false,
        employeeId: false,
      }
    },
    birthday: {
      name: 'Birthday View',
      description: 'Focus on birthdays and personal info',
      columns: {
        employee: true,
        contact: true,
        dateOfBirth: true,
        married: true,
        department: false,
        position: false,
        joinDate: false,
        role: false,
        address: false,
        emergencyContact: false,
        employeeId: false,
      }
    },
    location: {
      name: 'Location View',
      description: 'Geographic and address information',
      columns: {
        employee: true,
        contact: true,
        address: true,
        department: true,
        position: false,
        joinDate: false,
        role: false,
        dateOfBirth: false,
        married: false,
        emergencyContact: false,
        employeeId: false,
      }
    },
    experience: {
      name: 'Experience View',
      description: 'Tenure and career progression',
      columns: {
        employee: true,
        department: true,
        position: true,
        joinDate: true,
        role: true,
        contact: false,
        dateOfBirth: false,
        married: false,
        address: false,
        emergencyContact: false,
        employeeId: true,
      }
    },
    workProfile: {
      name: 'Work Profile',
      description: 'Professional information only',
      columns: {
        employee: true,
        contact: true,
        department: true,
        position: true,
        role: true,
        employeeId: true,
        joinDate: false,
        dateOfBirth: false,
        married: false,
        address: false,
        emergencyContact: false,
      }
    },
    emergency: {
      name: 'Emergency Contacts',
      description: 'Emergency contact information',
      columns: {
        employee: true,
        contact: true,
        emergencyContact: true,
        department: true,
        position: false,
        joinDate: false,
        role: false,
        dateOfBirth: false,
        married: false,
        address: false,
        employeeId: false,
      }
    }
  }

  // Column visibility state - default columns shown
  const [visibleColumns, setVisibleColumns] = useState(predefinedViews.default.columns)

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees/team')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return
    }

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEmployees()
      } else {
        alert('Failed to delete employee')
      }
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Error deleting employee')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEmployee(null)
    fetchEmployees()
  }

  const toggleColumn = (columnKey: keyof typeof visibleColumns) => {
    setCurrentView('custom')
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }))
  }

  const switchView = (viewKey: string) => {
    setCurrentView(viewKey)
    if (viewKey in predefinedViews) {
      setVisibleColumns(predefinedViews[viewKey as keyof typeof predefinedViews].columns)
    }
  }

  // Utility function to calculate days until next birthday
  const getDaysUntilBirthday = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null
    
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    
    // Create this year's birthday date
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    
    // If birthday already passed this year, calculate for next year
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = thisYearBirthday.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  // Utility function to calculate days until next work anniversary
  const getDaysUntilWorkAnniversary = (joinDate: string) => {
    const today = new Date()
    const joinDateObj = new Date(joinDate)
    
    // Create this year's anniversary date
    const thisYearAnniversary = new Date(today.getFullYear(), joinDateObj.getMonth(), joinDateObj.getDate())
    
    // If anniversary already passed this year, calculate for next year
    if (thisYearAnniversary < today) {
      thisYearAnniversary.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = thisYearAnniversary.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  // Utility function to calculate years of experience
  const getYearsOfExperience = (joinDate: string) => {
    const today = new Date()
    const joinDateObj = new Date(joinDate)
    const diffYears = today.getFullYear() - joinDateObj.getFullYear()
    const hasPassedAnniversary = today.getMonth() > joinDateObj.getMonth() || 
      (today.getMonth() === joinDateObj.getMonth() && today.getDate() >= joinDateObj.getDate())
    
    return hasPassedAnniversary ? diffYears : diffYears - 1
  }

  // Get unique values for filter dropdowns
  const departments = Array.from(new Set(employees.map(emp => emp.department?.name).filter(Boolean))).sort()
  const countries = Array.from(new Set(employees.map(emp => emp.country).filter(Boolean))) as string[]
  countries.sort()
  const joiningYears = Array.from(new Set(employees.map(emp => new Date(emp.joinDate).getFullYear().toString()))).sort((a, b) => parseInt(b) - parseInt(a))
  
  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = searchTerm === '' || 
      employee.firstName.toLowerCase().includes(searchLower) ||
      employee.lastName.toLowerCase().includes(searchLower) ||
      employee.user.email.toLowerCase().includes(searchLower) ||
      employee.employeeId.toLowerCase().includes(searchLower) ||
      employee.address?.toLowerCase().includes(searchLower) ||
      employee.city?.toLowerCase().includes(searchLower) ||
      employee.state?.toLowerCase().includes(searchLower) ||
      employee.country?.toLowerCase().includes(searchLower)
    
    const matchesDepartment = selectedDepartment === '' || employee.department?.name === selectedDepartment
    const matchesRole = selectedRole === '' || employee.user.role === selectedRole
    
    // Advanced filters
    const matchesMarriedStatus = selectedMarriedStatus === '' || 
      (selectedMarriedStatus === 'married' && employee.married) ||
      (selectedMarriedStatus === 'single' && !employee.married)
    
    const matchesCountry = selectedCountry === '' || employee.country === selectedCountry
    
    const matchesJoiningYear = selectedJoiningYear === '' || 
      new Date(employee.joinDate).getFullYear().toString() === selectedJoiningYear
    
    return matchesSearch && matchesDepartment && matchesRole && matchesMarriedStatus && matchesCountry && matchesJoiningYear
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Socioh Team
            </h1>
            <div className="text-sm text-gray-600">
              {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Selector */}
            <div className="relative">
              <select
                value={currentView}
                onChange={(e) => switchView(e.target.value)}
                className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title={currentView in predefinedViews ? predefinedViews[currentView as keyof typeof predefinedViews].description : 'Custom column selection'}
              >
                {Object.entries(predefinedViews).map(([key, view]) => (
                  <option key={key} value={key} title={view.description}>{view.name}</option>
                ))}
                {currentView === 'custom' && <option value="custom" title="Custom column selection">Custom View</option>}
              </select>
              {/* View description */}
              {currentView in predefinedViews && (
                <div className="absolute top-full right-0 mt-1 text-xs text-gray-500 whitespace-nowrap z-20 pointer-events-none">
                  {predefinedViews[currentView as keyof typeof predefinedViews].description}
                </div>
              )}
            </div>

            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
                </svg>
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm font-medium rounded-r-md border-l ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
            </div>
            
            {/* Column Selector */}
            <div className="relative">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Columns
              </button>
              
              {showColumnSelector && (
                <>
                  <div className="fixed inset-0 z-5" onClick={() => setShowColumnSelector(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Show/Hide Columns
                      </div>
                      {Object.entries(visibleColumns).map(([key, isVisible]) => (
                        <label key={key} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={() => toggleColumn(key as keyof typeof visibleColumns)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            {!readOnly && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2"
              >
                Add Employee
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onClose={handleFormClose}
          />
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDepartment('')
                  setSelectedRole('')
                  setSelectedMarriedStatus('')
                  setSelectedCountry('')
                  setSelectedJoiningYear('')
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <svg className={`w-4 h-4 mr-1 transition-transform ${showAdvancedFilters ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Advanced Filters
              {(selectedMarriedStatus || selectedCountry || selectedJoiningYear) && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Active
                </span>
              )}
            </button>
            
            {showAdvancedFilters && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {/* Marital Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    value={selectedMarriedStatus}
                    onChange={(e) => setSelectedMarriedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All</option>
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                  </select>
                </div>

                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Joining Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joining Year
                  </label>
                  <select
                    value={selectedJoiningYear}
                    onChange={(e) => setSelectedJoiningYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Years</option>
                    {joiningYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

        </div>

        {viewMode === 'table' ? (
          <EmployeeList
            employees={filteredEmployees}
            onEdit={readOnly ? undefined : handleEdit}
            onDelete={readOnly ? undefined : handleDelete}
            readOnly={readOnly}
            visibleColumns={visibleColumns}
            currentView={currentView}
            getDaysUntilBirthday={getDaysUntilBirthday}
            getDaysUntilWorkAnniversary={getDaysUntilWorkAnniversary}
            getYearsOfExperience={getYearsOfExperience}
          />
        ) : (
          <EmployeeGrid
            employees={filteredEmployees}
            onEdit={readOnly ? undefined : handleEdit}
            onDelete={readOnly ? undefined : handleDelete}
            readOnly={readOnly}
            visibleColumns={visibleColumns}
            currentView={currentView}
            getDaysUntilBirthday={getDaysUntilBirthday}
            getDaysUntilWorkAnniversary={getDaysUntilWorkAnniversary}
            getYearsOfExperience={getYearsOfExperience}
          />
        )}
      </div>
    </div>
  )
}
