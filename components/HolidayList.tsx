'use client'

import { useEffect, useState, useCallback } from 'react'

interface Holiday {
  id: string
  occasion: string
  startDate: string
  endDate: string
  createdAt: string
}

interface HolidayListProps {
  user: {
    name?: string | null
    email?: string | null
    role?: 'ADMIN' | 'USER'
  }
}

export default function HolidayList({ user }: HolidayListProps) {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [formData, setFormData] = useState({
    occasion: '',
    startDate: '',
    endDate: '',
  })

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1]
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  const fetchHolidays = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/holidays?year=${selectedYear}`
      if (selectedMonth) {
        url += `&month=${selectedMonth}`
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setHolidays(data)
      }
    } catch (error) {
      console.error('Error fetching holidays:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    fetchHolidays()
  }, [selectedYear, selectedMonth, fetchHolidays])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingHoliday
        ? `/api/holidays/${editingHoliday.id}`
        : '/api/holidays'
      const method = editingHoliday ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingHoliday(null)
        setFormData({ occasion: '', startDate: '', endDate: '' })
        fetchHolidays()
      } else {
        alert('Failed to save holiday')
      }
    } catch (error) {
      console.error('Error saving holiday:', error)
      alert('Error saving holiday')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return

    try {
      const response = await fetch(`/api/holidays/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchHolidays()
      } else {
        alert('Failed to delete holiday')
      }
    } catch (error) {
      console.error('Error deleting holiday:', error)
      alert('Error deleting holiday')
    }
  }

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setFormData({
      occasion: holiday.occasion,
      startDate: new Date(holiday.startDate).toISOString().split('T')[0],
      endDate: new Date(holiday.endDate).toISOString().split('T')[0],
    })
    setShowForm(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (startDate.toDateString() === endDate.toDateString()) {
      return formatDate(start)
    }

    return `${formatDate(start)} - ${formatDate(end)}`
  }

  return (
    <div className="px-4  sm:px-0">
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Holidays</h1> */}
        {user.role === 'ADMIN' && (
          <button
            onClick={() => {
              setEditingHoliday(null)
              setFormData({ occasion: '', startDate: '', endDate: '' })
              setShowForm(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Holiday
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Month
            </label>
            <select
              value={selectedMonth || ''}
              onChange={(e) =>
                setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)
              }
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Holiday Form Modal */}
      {showForm && user.role === 'ADMIN' && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingHoliday(null)
                }}
                className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Occasion *
                </label>
                <input
                  type="text"
                  required
                  value={formData.occasion}
                  onChange={(e) =>
                    setFormData({ ...formData, occasion: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingHoliday(null)
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingHoliday ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Holidays List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        ) : holidays.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">
              No holidays found for the selected period.
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {holidays.map((holiday) => (
              <li key={holiday.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {holiday.occasion}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDateRange(holiday.startDate, holiday.endDate)}
                    </p>
                  </div>
                  {user.role === 'ADMIN' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(holiday)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(holiday.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
