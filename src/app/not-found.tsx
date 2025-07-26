'use client'
import { Suspense } from 'react'
import NotFoundClient from '@/components/NotFoundClient'

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </div>
    }>
      <NotFoundClient />
    </Suspense>
  )
}