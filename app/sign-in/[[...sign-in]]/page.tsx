import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream font-inter">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl text-brown mb-1">
            Infusio <span className="text-olive">Analytics</span>
          </h1>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Panel de administración
          </p>
        </div>
        <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />
      </div>
    </main>
  );
}
