'use client'

import { useEffect, useState } from 'react'

interface Country {
  name: {
    common: string
  }
  cca2: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  dateOfBirth: string | null
  married: boolean
  marriageAnniversary: string | null
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
  const [uploading, setUploading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [formData, setFormData] = useState({
    phoneNumber: '',
    phoneCountryCode: '+1',
    dateOfBirth: '',
    married: false,
    marriageAnniversary: '',
    joinDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactPhoneCountryCode: '+1',
    emergencyContactRelation: '',
  })

  const countryCodes = [
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+86', country: 'China' },
    { code: '+7', country: 'Russia' },
    { code: '+61', country: 'Australia' },
    { code: '+55', country: 'Brazil' },
    { code: '+52', country: 'Mexico' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+31', country: 'Netherlands' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+45', country: 'Denmark' },
    { code: '+41', country: 'Switzerland' },
    { code: '+43', country: 'Austria' },
    { code: '+32', country: 'Belgium' },
  ]

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      if (response.ok) {
        const data = await response.json()
        const sortedCountries = data.sort((a: Country, b: Country) => 
          a.name.common.localeCompare(b.name.common)
        )
        setCountries(sortedCountries)
      }
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  const fetchEmployee = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setEmployee(data[0])
          setProfileImage(data[0].user.image)
          // Parse existing phone number to separate country code and number
          const parsePhoneNumber = (fullNumber: string) => {
            if (!fullNumber) return { countryCode: '+1', number: '' }
            
            const match = fullNumber.match(/^(\+\d{1,4})\s*(.*)$/)
            if (match) {
              return { countryCode: match[1], number: match[2] }
            }
            return { countryCode: '+1', number: fullNumber }
          }

          const mainPhone = parsePhoneNumber(data[0].phoneNumber || '')
          const emergencyPhone = parsePhoneNumber(data[0].emergencyContactPhone || '')

          setFormData({
            phoneNumber: mainPhone.number,
            phoneCountryCode: mainPhone.countryCode,
            dateOfBirth: data[0].dateOfBirth ? new Date(data[0].dateOfBirth).toISOString().split('T')[0] : '',
            married: data[0].married || false,
            marriageAnniversary: data[0].marriageAnniversary ? new Date(data[0].marriageAnniversary).toISOString().split('T')[0] : '',
            joinDate: new Date(data[0].joinDate).toISOString().split('T')[0],
            address: data[0].address || '',
            city: data[0].city || '',
            state: data[0].state || '',
            zipCode: data[0].zipCode || '',
            country: data[0].country || '',
            emergencyContactName: data[0].emergencyContactName || '',
            emergencyContactPhone: emergencyPhone.number,
            emergencyContactPhoneCountryCode: emergencyPhone.countryCode,
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
    fetchCountries()
  }, [userId])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfileImage(data.url)
        // Refresh employee data to get updated image
        await fetchEmployee()
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employee) return

    setSaving(true)
    try {
      // Combine country code with phone number before sending
      const submitData = {
        ...formData,
        phoneNumber: formData.phoneNumber 
          ? `${formData.phoneCountryCode} ${formData.phoneNumber}` 
          : '',
        emergencyContactPhone: formData.emergencyContactPhone 
          ? `${formData.emergencyContactPhoneCountryCode} ${formData.emergencyContactPhone}` 
          : '',
      }

      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
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

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const handleCountrySelect = (countryName: string) => {
    setFormData({ ...formData, country: countryName })
    setCountrySearch('')
    setShowCountryDropdown(false)
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
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Employee Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and contact information
                </p>
              </div>
              <div className="flex flex-col items-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
                <label className="mt-2 cursor-pointer">
                  <span className="text-xs text-blue-600 hover:text-blue-800">
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
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
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <select
                          value={formData.phoneCountryCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneCountryCode: e.target.value,
                            })
                          }
                          className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          {countryCodes.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.code} ({item.country})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneNumber: e.target.value,
                            })
                          }
                          placeholder="Enter phone number"
                          className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Join Date
                      </label>
                      <input
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            joinDate: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Marital Status
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="married"
                          type="checkbox"
                          checked={formData.married}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              married: e.target.checked,
                              marriageAnniversary: e.target.checked ? formData.marriageAnniversary : '',
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="married" className="ml-2 block text-sm text-gray-900">
                          Married
                        </label>
                      </div>

                      {formData.married && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Marriage Anniversary
                          </label>
                          <input
                            type="date"
                            value={formData.marriageAnniversary}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                marriageAnniversary: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Address
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <div className="relative mt-1">
                          <input
                            type="text"
                            value={showCountryDropdown ? countrySearch : formData.country}
                            onChange={(e) => {
                              setCountrySearch(e.target.value)
                              setShowCountryDropdown(true)
                            }}
                            onFocus={() => {
                              setCountrySearch(formData.country)
                              setShowCountryDropdown(true)
                            }}
                            placeholder="Search and select country"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          />
                          {showCountryDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                              {filteredCountries.length > 0 ? (
                                filteredCountries.slice(0, 10).map((country) => (
                                  <div
                                    key={country.cca2}
                                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 text-gray-900"
                                    onClick={() => handleCountrySelect(country.name.common)}
                                  >
                                    <span className="block truncate text-gray-900">
                                      {country.name.common}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-900">
                                  No countries found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {showCountryDropdown && (
                          <div
                            className="fixed inset-0 z-5"
                            onClick={() => setShowCountryDropdown(false)}
                          />
                        )}
                      </div>

                      <div className="col-span-1"></div>

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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <select
                            value={formData.emergencyContactPhoneCountryCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emergencyContactPhoneCountryCode: e.target.value,
                              })
                            }
                            className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            {countryCodes.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.code} ({item.country})
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={formData.emergencyContactPhone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emergencyContactPhone: e.target.value,
                              })
                            }
                            placeholder="Enter phone number"
                            className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          />
                        </div>
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    Date of Birth
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.dateOfBirth 
                      ? new Date(employee.dateOfBirth).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'Not provided'
                    }
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Marital Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.married ? 'Married' : 'Single'}
                    {employee.married && employee.marriageAnniversary && (
                      <div className="text-gray-600 text-xs mt-1">
                        Anniversary: {new Date(employee.marriageAnniversary).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Department
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.department?.name || 'Not assigned'}
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
                    {new Date(employee.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
