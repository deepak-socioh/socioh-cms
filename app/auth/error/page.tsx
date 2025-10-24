import Link from 'next/link'

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string; domain?: string }
}) {
  const error = searchParams.error
  const domain = searchParams.domain

  let errorMessage = 'An error occurred during authentication.'

  if (error === 'AccessDenied') {
    errorMessage =
      'Access denied. Your email domain is not authorized to access this application.'
  } else if (error === 'Configuration') {
    errorMessage = 'There is a problem with the server configuration.'
  } else if (error === 'EmailNotAllowed') {
    errorMessage = `Your email domain "${domain}" is not authorized. Only emails from the allowed domain can sign in.`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <div className="flex justify-center mb-4">
            <img
              src="https://cdn.prod.website-files.com/5f32467af6c27b4300272729/61f2481dd6560ec5dc062678_Emblem.svg"
              alt="Socioh Logo"
              className="h-20 w-20"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-center text-sm text-red-800">{errorMessage}</p>
            {error && (
              <p className="mt-2 text-center text-xs text-red-600">
                Error code: {error}
              </p>
            )}
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
