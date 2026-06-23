import React from "react";
import { checkServicesHealth } from "@/app/lib/services/health";
import ServiceCard from "@/app/ui/status/ServiceCard";
import StatusOverview from "@/app/ui/status/StatusOverview";
import RefreshButton from "@/app/ui/status/RefreshButton";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const data = await checkServicesHealth();

  return (
    <div className="space-y-8 max-w-screen-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold mb-1">
            Estado del Sistema
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitoreo en tiempo real de las fuentes de datos del ecosistema Infusio
          </p>
        </div>

        <RefreshButton />
      </div>

      <StatusOverview
        mocksEnabled={data.mocksEnabled}
        timestamp={data.timestamp}
        services={data.services}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </div>
  );
}
