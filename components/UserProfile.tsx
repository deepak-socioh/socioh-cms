'use client'

import { useEffect, useState } from 'react'

interface Employee {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  dateOfBirth: string | null
  department: string
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
  user: {
    id: string
    name: string | null
    email: string
    role: 'ADMIN' | 'USER'
  }
}

interface UserProfileProps {
  userId: string
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  })

  const fetchEmployee = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setEmployee(data[0])
          setFormData({
            phoneNumber: data[0].phoneNumber || '',
            address: data[0].address || '',
            city: data[0].city || '',
            state: data[0].state || '',
            zipCode: data[0].zipCode || '',
            country: data[0].country || '',
            emergencyContactName: data[0].emergencyContactName || '',
            emergencyContactPhone: data[0].emergencyContactPhone || '',
            emergencyContactRelation: data[0].emergencyContactRelation || '',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching employee:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployee()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employee) return

    setSaving(true)
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchEmployee()
        setEditing(false)
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            Your employee profile has not been created yet. Please contact an
            administrator.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Employee Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and contact information
            </p>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Address
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) =>
                            setFormData({ ...formData, zipCode: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({ ...formData, country: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContactName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              emergencyContactName: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyContactPhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              emergencyContactPhone: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Relation
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContactRelation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              emergencyContactRelation: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      fetchEmployee()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.firstName} {employee.lastName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Employee ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.employeeId}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.user.email}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.phoneNumber || 'Not provided'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Department
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.department}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Position
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.position}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Join Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.address && employee.city ? (
                      <>
                        {employee.address}
                        <br />
                        {employee.city}
                        {employee.state && `, ${employee.state}`}
                        {employee.zipCode && ` ${employee.zipCode}`}
                        <br />
                        {employee.country}
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Emergency Contact
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.emergencyContactName ? (
                      <>
                        {employee.emergencyContactName}
                        {employee.emergencyContactRelation &&
                          ` (${employee.emergencyContactRelation})`}
                        <br />
                        {employee.emergencyContactPhone}
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
