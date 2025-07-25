import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative min-h-[calc(100vh-0rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link
            href="/"
            className="text-xl font-bold flex items-center gap-2"
            aria-label="edskool Home"
          >
            <Image
              src="/logo-dark.png"
              alt="edskool Logo"
              width={120}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &quot;Education is not preparation for life; education is life
              itself.&quot;
            </p>
            <footer className="text-sm">John Dewey</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
