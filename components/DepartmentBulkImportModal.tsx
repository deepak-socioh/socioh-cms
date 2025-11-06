'use client'

import { useState } from 'react'

interface DepartmentBulkImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (departmentNames: string[]) => Promise<void>
}

export default function DepartmentBulkImportModal({ isOpen, onClose, onImport }: DepartmentBulkImportModalProps) {
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImport = async () => {
    if (!inputText.trim()) {
      setError('Please enter department names')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Split by new lines and filter out empty lines
      const departmentNames = inputText
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0)

      if (departmentNames.length === 0) {
        setError('No valid department names found')
        return
      }

      await onImport(departmentNames)
      setInputText('')
      onClose()
    } catch (importError) {
      setError('Failed to import departments')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setInputText('')
    setError('')
    onClose()
  }

  const sampleData = `Engineering
Marketing
Sales
Human Resources
Finance
Operations
Customer Support
Product Management
Quality Assurance
Business Development`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Bulk Import Departments
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
            Enter department names, one per line. If a department already exists, it will be skipped.
          </p>
          
          <details className="mb-4">
            <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-800 dark:hover:text-blue-300">
              Show sample department names
            </summary>
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {sampleData}
              </pre>
            </div>
          </details>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Department Names (one per line)
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter department names, one per line..."
            className="flex-1 min-h-[200px] w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
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
            disabled={loading || !inputText.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Importing...' : 'Import Departments'}
          </button>
        </div>
      </div>
    </div>
  )
}