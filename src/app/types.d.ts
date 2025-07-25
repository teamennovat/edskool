import "next";

declare module "next" {
  export type PageProps<
    TParams extends Record<string, string> = object,
    TSearchParams extends Record<string, string | string[]> = object
  > = {
    params: TParams;
    searchParams: TSearchParams;
  };
}