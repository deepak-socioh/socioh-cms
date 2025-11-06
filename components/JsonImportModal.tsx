'use client'

import { useState } from 'react'

interface JsonImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (jsonData: any[]) => Promise<void>
}

export default function JsonImportModal({ isOpen, onClose, onImport }: JsonImportModalProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      setError('Please enter JSON data')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const data = JSON.parse(jsonInput)
      
      if (!Array.isArray(data)) {
        setError('JSON must be an array of employee objects')
        return
      }

      if (data.length === 0) {
        setError('Array cannot be empty')
        return
      }

      await onImport(data)
      setJsonInput('')
      onClose()
    } catch (parseError) {
      if (parseError instanceof SyntaxError) {
        setError('Invalid JSON format')
      } else {
        setError('Failed to import data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setJsonInput('')
    setError('')
    onClose()
  }

  const sampleData = [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1234567890",
      "dateOfBirth": "1990-01-15",
      "department": "Engineering",
      "position": "Software Engineer",
      "employeeId": "EMP001",
      "joinDate": "2023-01-01",
      "address": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105",
      "country": "USA",
      "emergencyContactName": "Jane Doe",
      "emergencyContactPhone": "+1234567891",
      "emergencyContactRelation": "Spouse",
      "married": true,
      "marriageAnniversary": "2018-06-15",
      "alternateEmail": "john.personal@email.com",
      "bankAccountHolderName": "John Doe",
      "bankAccountNumber": "1234567890",
      "bankIFSCCode": "BANK0001234",
      "role": "USER"
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Import Employee Data (JSON)
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Import employee data using a JSON array. If an employee with the same email exists, their record will be updated. Otherwise, a new employee will be created.
          </p>
          
          <details className="mb-4">
            <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-800 dark:hover:text-blue-300">
              Show sample JSON format
            </summary>
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                {JSON.stringify(sampleData, null, 2)}
              </pre>
            </div>
          </details>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            JSON Data
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON array here..."
            className="flex-1 min-h-[300px] w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={loading || !jsonInput.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Importing...' : 'Import Data'}
          </button>
        </div>
      </div>
    </div>
  )
}