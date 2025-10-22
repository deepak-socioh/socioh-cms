import Link from 'next/link'

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error

  let errorMessage = 'An error occurred during authentication.'

  if (error === 'AccessDenied') {
    errorMessage =
      'Access denied. Your email domain is not authorized to access this application.'
  } else if (error === 'Configuration') {
    errorMessage = 'There is a problem with the server configuration.'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-center text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
        <div className="text-center">
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  )
}
