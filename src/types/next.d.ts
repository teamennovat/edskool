import type {} from 'next';
/// <reference types="next/image-types/global" />

import type { Metadata, ResolvingMetadata } from 'next';

type ParamsInput = {
  [key: string]: string | string[];
};

type SearchParamsInput = {
  [key: string]: string | string[] | undefined;
};

declare module 'next' {
  export interface PageProps<
    P extends ParamsInput = ParamsInput,
    SP extends SearchParamsInput = SearchParamsInput
  > {
    params: P;
    searchParams?: SP;
  }

  export interface GenerateMetadata {
    (props: PageProps, parent: ResolvingMetadata): Promise<Metadata> | Metadata;
  }
}
