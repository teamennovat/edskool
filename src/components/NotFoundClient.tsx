'use client'

import { useEffect, useState } from 'react'

export default function NotFoundClient() {
  const [errorCode, setErrorCode] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    setErrorCode(code)
  }, [])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      {errorCode && (
        <p className="text-sm text-muted-foreground">Error code: {errorCode}</p>
      )}
    </div>
  )
}
