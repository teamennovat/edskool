import { Suspense } from 'react'
import NotFoundClient from '@/components/NotFoundClient'

export default function NotFound() {
  return (
    <Suspense 
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
      }
    >
      <NotFoundClient />
    </Suspense>
  )
}
