'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function NotFoundContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      {code && (
        <p className="text-sm text-muted-foreground">Error code: {code}</p>
      )}
    </div>
  )
}

export default function NotFoundClient() {
  return (
    <Suspense>
      <NotFoundContent />
    </Suspense>
  )
}
