import React from "react";
import AppBadge from "@/app/ui/AppBadge";

export interface Service {
  name: string;
  url: string;
  status: "online" | "offline" | "mocked";
  latency: number;
  error?: string;
}

interface ServiceCardProps {
  service: Service;
}

const getServiceAppSource = (name: string): "buyer" | "seller" | "payments" | "shipping" => {
  const lower = name.toLowerCase();
  if (lower.includes("buyer")) return "buyer";
  if (lower.includes("seller")) return "seller";
  if (lower.includes("payment")) return "payments";
  return "shipping";
};

const getServiceDescription = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("buyer")) {
    return "Origen de datos de usuarios, transacciones globales, carritos abandonados y favoritos.";
  }
  if (lower.includes("seller")) {
    return "Acceso al catálogo de productos activos, niveles de stock e inventario por categoría.";
  }
  if (lower.includes("payment")) {
    return "Servicio de auditoría de transacciones, pasarela de cobros y tasa de conversión.";
  }
  return "Logística de distribución, asignación de riders y tiempos promedio de entrega.";
};

const maskUrl = (urlStr: string) => {
  if (!urlStr || urlStr === "No configurada") return "No configurada";
  try {
    const url = new URL(urlStr);
    return `${url.protocol}//${url.host}${url.pathname}`;
  } catch {
    return urlStr;
  }
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const appSource = getServiceAppSource(service.name);
  const isOnline = service.status === "online";
  const isMocked = service.status === "mocked";

  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-lg font-bold text-brown">{service.name}</span>
            <AppBadge source={appSource} />
          </div>

          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${
              isOnline ? "bg-olive animate-pulse" : isMocked ? "bg-amber-500" : "bg-red-500"
            }`} />
            <span className={`text-xs font-semibold tracking-wider uppercase ${
              isOnline ? "text-olive" : isMocked ? "text-amber-600" : "text-red-600"
            }`}>
              {isOnline ? "Online" : isMocked ? "Simulado" : "Offline"}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {getServiceDescription(service.name)}
        </p>

        <div className="space-y-2 bg-[#f4f1ea]/40 rounded-xl p-3.5 border border-tan/30 text-[11px] font-mono text-muted-foreground mb-6">
          <div className="flex justify-between gap-4 overflow-hidden">
            <span className="shrink-0 text-brown">Endpoint:</span>
            <span className="truncate text-right" title={service.url}>
              {maskUrl(service.url)}
            </span>
          </div>
          {service.error && (
            <div className="flex justify-between gap-4 text-red-600 font-semibold">
              <span className="shrink-0">Detalle:</span>
              <span className="text-right">{service.error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-tan/40 flex items-center justify-between text-xs">
        <span className="text-muted-foreground uppercase tracking-wider font-medium">Latencia</span>
        {isMocked ? (
          <span className="font-mono text-muted-foreground/60">—</span>
        ) : (
          <span className={`font-mono font-bold ${
            service.latency < 250
              ? "text-olive"
              : service.latency < 750
              ? "text-amber-600"
              : "text-red-500"
          }`}>
            {service.latency} ms
          </span>
        )}
      </div>
    </div>
  );
}
