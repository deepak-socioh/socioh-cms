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
  alternateEmail?: string | null
  panCardUrl?: string | null
  bankAccountHolderName?: string | null
  bankAccountNumber?: string | null
  bankIFSCCode?: string | null
  user: {
    id: string
    name: string | null
    email: string
    role: 'ADMIN' | 'USER'
    image?: string | null
  }
}

interface ProfileCardsProps {
  userId: string
}

export default function ProfileCards({ userId }: ProfileCardsProps) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingPan, setUploadingPan] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [panCardUrl, setPanCardUrl] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  // Form states for different cards
  const [personalForm, setPersonalForm] = useState({
    phoneNumber: '',
    phoneCountryCode: '+1',
    dateOfBirth: '',
    married: false,
    marriageAnniversary: '',
    alternateEmail: '',
  })

  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const [emergencyForm, setEmergencyForm] = useState({
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactPhoneCountryCode: '+1',
    emergencyContactRelation: '',
  })

  const [bankingForm, setBankingForm] = useState({
    bankAccountHolderName: '',
    bankAccountNumber: '',
    bankIFSCCode: '',
  })

  const countryCodes = [
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+61', country: 'Australia' },
  ]

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      if (response.ok) {
        const data = await response.json()
        setCountries(data.sort((a: Country, b: Country) => 
          a.name.common.localeCompare(b.name.common)
        ))
      }
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  const fetchEmployee = async () => {
    try {
      const response = await fetch('/api/employees/me')
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setEmployee(data[0])
          setProfileImage(data[0].user.image)
          setPanCardUrl(data[0].panCardUrl)
          
          // Parse phone numbers
          const parsePhoneNumber = (fullNumber: string) => {
            if (!fullNumber) return { countryCode: '+1', number: '' }
            const parts = fullNumber.split(' ')
            if (parts.length >= 2) {
              return { countryCode: parts[0], number: parts.slice(1).join(' ') }
            }
            return { countryCode: '+1', number: fullNumber }
          }

          const mainPhone = parsePhoneNumber(data[0].phoneNumber || '')
          const emergencyPhone = parsePhoneNumber(data[0].emergencyContactPhone || '')

          setPersonalForm({
            phoneNumber: mainPhone.number,
            phoneCountryCode: mainPhone.countryCode,
            dateOfBirth: data[0].dateOfBirth ? new Date(data[0].dateOfBirth).toISOString().split('T')[0] : '',
            married: data[0].married || false,
            marriageAnniversary: data[0].marriageAnniversary ? new Date(data[0].marriageAnniversary).toISOString().split('T')[0] : '',
            alternateEmail: data[0].alternateEmail || '',
          })

          setAddressForm({
            address: data[0].address || '',
            city: data[0].city || '',
            state: data[0].state || '',
            zipCode: data[0].zipCode || '',
            country: data[0].country || '',
          })

          setEmergencyForm({
            emergencyContactName: data[0].emergencyContactName || '',
            emergencyContactPhone: emergencyPhone.number,
            emergencyContactPhoneCountryCode: emergencyPhone.countryCode,
            emergencyContactRelation: data[0].emergencyContactRelation || '',
          })

          setBankingForm({
            bankAccountHolderName: data[0].bankAccountHolderName || '',
            bankAccountNumber: data[0].bankAccountNumber || '',
            bankIFSCCode: data[0].bankIFSCCode || '',
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

  const handlePanCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPan(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setPanCardUrl(data.url)
        await fetchEmployee()
      } else {
        alert('Failed to upload PAN card')
      }
    } catch (error) {
      console.error('Error uploading PAN card:', error)
      alert('Error uploading PAN card')
    } finally {
      setUploadingPan(false)
    }
  }

  const handleSaveCard = async (cardType: string, formData: any) => {
    if (!employee) return

    try {
      let submitData = { ...formData }

      // Handle phone number formatting for personal and emergency cards
      if (cardType === 'personal') {
        submitData = {
          ...submitData,
          phoneNumber: submitData.phoneNumber 
            ? `${submitData.phoneCountryCode} ${submitData.phoneNumber}` 
            : '',
        }
      } else if (cardType === 'emergency') {
        submitData = {
          ...submitData,
          emergencyContactPhone: submitData.emergencyContactPhone 
            ? `${submitData.emergencyContactPhoneCountryCode} ${submitData.emergencyContactPhone}` 
            : '',
        }
      } else if (cardType === 'documents') {
        submitData = { panCardUrl: panCardUrl }
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
        setEditingCard(null)
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    }
  }

  const handleCountrySelect = (countryName: string) => {
    setAddressForm({ ...addressForm, country: countryName })
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
      <div className="text-center py-12">
        <p className="text-gray-500">No employee data found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
        </div>
        <div className="flex items-center space-x-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-medium text-lg">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </span>
            </div>
          )}
          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {uploading ? 'Uploading...' : 'Change Photo'}
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

      {/* Personal Information Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <button
            onClick={() => setEditingCard(editingCard === 'personal' ? null : 'personal')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {editingCard === 'personal' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingCard === 'personal' ? (
          <form onSubmit={(e) => {
            e.preventDefault()
            handleSaveCard('personal', personalForm)
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <select
                    value={personalForm.phoneCountryCode}
                    onChange={(e) =>
                      setPersonalForm({
                        ...personalForm,
                        phoneCountryCode: e.target.value,
                      })
                    }
                    className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    {countryCodes.map((cc) => (
                      <option key={cc.code} value={cc.code}>
                        {cc.code} ({cc.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={personalForm.phoneNumber}
                    onChange={(e) =>
                      setPersonalForm({
                        ...personalForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="flex-1 border border-gray-300 rounded-r-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={personalForm.dateOfBirth}
                  onChange={(e) =>
                    setPersonalForm({
                      ...personalForm,
                      dateOfBirth: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Alternate Email</label>
                <input
                  type="email"
                  value={personalForm.alternateEmail}
                  onChange={(e) =>
                    setPersonalForm({
                      ...personalForm,
                      alternateEmail: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter alternate email"
                />
              </div>
              <div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="married"
                      type="checkbox"
                      checked={personalForm.married}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          married: e.target.checked,
                          marriageAnniversary: e.target.checked ? personalForm.marriageAnniversary : '',
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="married" className="ml-2 block text-sm text-gray-900">
                      Married
                    </label>
                  </div>
                  {personalForm.married && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Anniversary</label>
                      <input
                        type="date"
                        value={personalForm.marriageAnniversary}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            marriageAnniversary: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="text-sm text-gray-900">{employee.phoneNumber || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="text-sm text-gray-900">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Alternate Email</dt>
                <dd className="text-sm text-gray-900">{employee.alternateEmail || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Marital Status</dt>
                <dd className="text-sm text-gray-900">
                  {employee.married ? 'Married' : 'Single'}
                  {employee.married && employee.marriageAnniversary && (
                    <span className="text-xs text-gray-500 block">
                      Anniversary: {new Date(employee.marriageAnniversary).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  )}
                </dd>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Information Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
          <button
            onClick={() => setEditingCard(editingCard === 'address' ? null : 'address')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {editingCard === 'address' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingCard === 'address' ? (
          <form onSubmit={(e) => {
            e.preventDefault()
            handleSaveCard('address', addressForm)
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  value={addressForm.zipCode}
                  onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  value={countrySearch || addressForm.country}
                  onChange={(e) => {
                    setCountrySearch(e.target.value)
                    setShowCountryDropdown(true)
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {showCountryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                    {countries
                      .filter(country =>
                        country.name.common.toLowerCase().includes(countrySearch.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((country) => (
                        <div
                          key={country.cca2}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white"
                          onClick={() => handleCountrySelect(country.name.common)}
                        >
                          {country.name.common}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="text-sm text-gray-900">
                {employee.address && employee.city ? (
                  <>
                    {employee.address}<br />
                    {employee.city}{employee.state && `, ${employee.state}`} {employee.zipCode}<br />
                    {employee.country}
                  </>
                ) : (
                  'Not provided'
                )}
              </dd>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
          <button
            onClick={() => setEditingCard(editingCard === 'emergency' ? null : 'emergency')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {editingCard === 'emergency' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingCard === 'emergency' ? (
          <form onSubmit={(e) => {
            e.preventDefault()
            handleSaveCard('emergency', emergencyForm)
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                type="text"
                value={emergencyForm.emergencyContactName}
                onChange={(e) =>
                  setEmergencyForm({
                    ...emergencyForm,
                    emergencyContactName: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <select
                    value={emergencyForm.emergencyContactPhoneCountryCode}
                    onChange={(e) =>
                      setEmergencyForm({
                        ...emergencyForm,
                        emergencyContactPhoneCountryCode: e.target.value,
                      })
                    }
                    className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    {countryCodes.map((cc) => (
                      <option key={cc.code} value={cc.code}>
                        {cc.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={emergencyForm.emergencyContactPhone}
                    onChange={(e) =>
                      setEmergencyForm({
                        ...emergencyForm,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                    className="flex-1 border border-gray-300 rounded-r-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relation</label>
                <input
                  type="text"
                  value={emergencyForm.emergencyContactRelation}
                  onChange={(e) =>
                    setEmergencyForm({
                      ...emergencyForm,
                      emergencyContactRelation: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
              <dd className="text-sm text-gray-900">
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
          </div>
        )}
      </div>

      {/* Documents Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Documents</h3>
          <button
            onClick={() => setEditingCard(editingCard === 'documents' ? null : 'documents')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {editingCard === 'documents' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingCard === 'documents' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
              <div className="flex items-center space-x-4">
                {panCardUrl && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={panCardUrl}
                      alt="PAN Card"
                      className="h-20 w-32 object-cover border rounded"
                    />
                    <a
                      href={panCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Full Size
                    </a>
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {uploadingPan ? 'Uploading...' : panCardUrl ? 'Change PAN Card' : 'Upload PAN Card'}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePanCardUpload}
                    disabled={uploadingPan}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCard('documents', {})}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">PAN Card</dt>
              <dd className="text-sm text-gray-900">
                {employee.panCardUrl ? (
                  <div className="flex items-center space-x-4">
                    <img
                      src={employee.panCardUrl}
                      alt="PAN Card"
                      className="h-16 w-24 object-cover border rounded"
                    />
                    <a
                      href={employee.panCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Document
                    </a>
                  </div>
                ) : (
                  'Not uploaded'
                )}
              </dd>
            </div>
          </div>
        )}
      </div>

      {/* Banking Details Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Banking Details</h3>
          <button
            onClick={() => setEditingCard(editingCard === 'banking' ? null : 'banking')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {editingCard === 'banking' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingCard === 'banking' ? (
          <form onSubmit={(e) => {
            e.preventDefault()
            handleSaveCard('banking', bankingForm)
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
              <input
                type="text"
                value={bankingForm.bankAccountHolderName}
                onChange={(e) =>
                  setBankingForm({
                    ...bankingForm,
                    bankAccountHolderName: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter account holder name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                <input
                  type="text"
                  value={bankingForm.bankAccountNumber}
                  onChange={(e) =>
                    setBankingForm({
                      ...bankingForm,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <input
                  type="text"
                  value={bankingForm.bankIFSCCode}
                  onChange={(e) =>
                    setBankingForm({
                      ...bankingForm,
                      bankIFSCCode: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Banking Details</dt>
              <dd className="text-sm text-gray-900">
                {employee.bankAccountHolderName || employee.bankAccountNumber || employee.bankIFSCCode ? (
                  <div className="space-y-1">
                    {employee.bankAccountHolderName && (
                      <div><span className="font-medium">Account Holder:</span> {employee.bankAccountHolderName}</div>
                    )}
                    {employee.bankAccountNumber && (
                      <div><span className="font-medium">Account Number:</span> {employee.bankAccountNumber}</div>
                    )}
                    {employee.bankIFSCCode && (
                      <div><span className="font-medium">IFSC Code:</span> {employee.bankIFSCCode}</div>
                    )}
                  </div>
                ) : (
                  'Not provided'
                )}
              </dd>
            </div>
          </div>
        )}
      </div>

      {/* Work Information Card (Read-only) */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Work Information</h3>
          <span className="text-xs text-gray-500">Contact admin to update</span>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
              <dd className="text-sm text-gray-900">{employee.employeeId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Position</dt>
              <dd className="text-sm text-gray-900">{employee.position}</dd>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="text-sm text-gray-900">{employee.department?.name || 'Not assigned'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Join Date</dt>
              <dd className="text-sm text-gray-900">
                {new Date(employee.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}