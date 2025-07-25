import type { Metadata, ResolvingMetadata } from 'next'

declare module 'next' {
  interface PageProps {
    params: { [key: string]: string }
    searchParams?: { [key: string]: string | string[] | undefined }
  }

  interface GenerateMetadata {
    (props: PageProps, parent: ResolvingMetadata): Promise<Metadata> | Metadata
  }
}
