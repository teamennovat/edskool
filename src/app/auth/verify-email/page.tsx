import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Check your email</h1>
      <p className="text-center text-muted-foreground max-w-sm">
        We&apos;ve sent you a verification link. Please check your email and click the link to verify your account.
      </p>
      <Link
        href="/auth/signin"
        className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
      >
        Back to Sign in
      </Link>
    </div>
  );
}
