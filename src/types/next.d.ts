import type { NextPage } from 'next'

declare module 'next' {
  export type PageProps = {
    params: { [key: string]: string }
    searchParams?: { [key: string]: string | string[] | undefined }
  }

  export type Page<P = {}, IP = P> = NextPage<P, IP>
}
