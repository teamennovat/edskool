import { Metadata, ResolvingMetadata } from 'next';

// Define the types for params in dynamic routes
export type DynamicRouteParams = {
  [key: string]: string;
};

// Page component props type
export type PageProps<P extends DynamicRouteParams = DynamicRouteParams> = {
  params: P;
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Metadata function props type
export type GenerateMetadataProps<P extends DynamicRouteParams = DynamicRouteParams> = {
  params: P;
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Type for generateMetadata function
export type GenerateMetadata<P extends DynamicRouteParams = DynamicRouteParams> = (
  props: GenerateMetadataProps<P>,
  parent: ResolvingMetadata
) => Promise<Metadata> | Metadata;
