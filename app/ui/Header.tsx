"use client";

import { usePathname } from "next/navigation";
import ExportDropdown from "@/app/ui/ExportDropdown";
import ThemeToggle from "@/app/ui/ThemeToggle";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Resumen General",
  "/dashboard/orders": "Pedidos",
  "/dashboard/products": "Productos",
  "/dashboard/users": "Usuarios",
  "/dashboard/shipping": "Envíos",
  "/dashboard/payments": "Pagos",
};

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Analytics";
  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-white border-b border-tan px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-xl text-muted-foreground hover:text-brown hover:bg-muted lg:hidden transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-brown">{title}</h1>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">{today}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {pathname === "/dashboard" && <ExportDropdown />}
        <ThemeToggle />
        <span className="flex items-center gap-1.5 text-xs font-medium text-terracotta bg-terracotta/10 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          EN VIVO
        </span>
      </div>
    </header>
  );
}
