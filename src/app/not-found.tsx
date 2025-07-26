import { Suspense } from 'react'
import NotFoundClient from '@/components/NotFoundClient'

export default function NotFound() {
  return (
    <Suspense>
      <NotFoundClient />
    </Suspense>
  )
}
