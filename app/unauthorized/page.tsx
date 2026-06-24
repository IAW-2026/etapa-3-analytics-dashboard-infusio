import React from "react";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4 font-inter">
      <div className="max-w-md w-full bg-white rounded-3xl border border-tan p-8 sm:p-10 shadow-sm text-center">
        {/* Shield/Lock icon */}
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold font-playfair text-brown mb-3">
          Acceso Denegado
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Tu cuenta no cuenta con los permisos necesarios para acceder a este panel de administración.
          Solo los usuarios con el rol <code className="bg-tan/40 px-1.5 py-0.5 rounded text-brown font-mono text-xs font-semibold">admin</code> están autorizados.
        </p>

        <div className="flex flex-col gap-3">
          <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
            <button className="w-full bg-olive text-white px-5 py-3 rounded-2xl font-medium shadow-sm hover:bg-olive/90 transition-colors cursor-pointer">
              Cerrar sesión / Cambiar cuenta
            </button>
          </SignOutButton>

          <Link href="/" className="w-full text-center text-sm text-muted-foreground hover:text-brown transition-colors py-2">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
