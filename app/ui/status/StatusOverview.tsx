import React from "react";
import type { Service } from "./ServiceCard";

interface StatusOverviewProps {
  mocksEnabled: boolean;
  timestamp: string;
  services: Service[];
}

export default function StatusOverview({ mocksEnabled, timestamp, services }: StatusOverviewProps) {
  const onlineCount = services.filter((s) => s.status !== "offline").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl border border-tan p-5 shadow-sm">
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Origen de Datos</p>
        <p className="text-lg font-bold text-brown mt-1">
          {mocksEnabled ? "Simulados (Mocks)" : "Servicios en Vivo"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {mocksEnabled
            ? "La aplicación está mostrando datos locales de prueba para desarrollo."
            : "Conexión activa con los endpoints en la nube de Infusio."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-tan p-5 shadow-sm">
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Último Control</p>
        <p className="text-lg font-bold text-brown mt-1">
          {new Date(timestamp).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(timestamp).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-tan p-5 shadow-sm">
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Servicios Online</p>
        <p className="text-lg font-bold text-brown mt-1">
          {onlineCount} / {services.length}
        </p>
        <div className="w-full bg-[#f4f1ea] rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-olive h-1.5 rounded-full origin-left transition-transform duration-500"
            style={{
              width: "100%",
              transform: `scaleX(${onlineCount / services.length})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
