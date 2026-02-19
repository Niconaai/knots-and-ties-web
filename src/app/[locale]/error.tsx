'use client'

import { useEffect } from 'react'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // e.g., Sentry.captureException(error)
    }
  }, [error])

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        
        <h1 className="text-3xl font-serif text-zinc-900">
          Something went wrong
        </h1>
        
        <p className="text-zinc-600">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={reset}
            className="px-8 py-3 bg-zinc-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors"
          >
            Try Again
          </button>
          
          <a
            href="/"
            className="px-8 py-3 border border-zinc-300 text-zinc-900 text-sm font-bold uppercase tracking-widest hover:border-zinc-900 transition-colors"
          >
            Go Home
          </a>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left p-4 bg-red-50 border border-red-200 rounded-lg">
            <summary className="text-red-800 font-medium cursor-pointer">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs text-red-700 overflow-auto whitespace-pre-wrap">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </main>
  )
}
