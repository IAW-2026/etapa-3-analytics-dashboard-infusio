"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Resumen General",
  "/dashboard/orders": "Pedidos",
  "/dashboard/products": "Productos",
  "/dashboard/users": "Usuarios",
  "/dashboard/shipping": "Envíos",
  "/dashboard/payments": "Pagos",
};

export default function Header() {
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
      <div>
        <h1 className="text-xl font-semibold text-brown">{title}</h1>
        <p className="text-xs text-muted-foreground capitalize mt-0.5">{today}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-terracotta bg-terracotta/10 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          EN VIVO
        </span>
      </div>
    </header>
  );
}
