"use client";

import React from "react";
import PaginatedTable from "./PaginatedTable";

interface Shipment {
  id: string;
  orderId: string;
  destinationCity: string;
  carrier: string;
  status: string;
  createdAt: string;
}

interface ShippingTableProps {
  data: Shipment[];
  pageSize?: number;
}

const SHIPMENT_STYLES: Record<string, string> = {
  delivered: "bg-olive/10 text-olive",
  in_transit: "bg-blue-50 text-blue-700",
  processing: "bg-yellow-50 text-yellow-700",
  failed: "bg-red-50 text-red-700",
};

const SHIPMENT_LABELS: Record<string, string> = {
  delivered: "Entregado",
  in_transit: "En tránsito",
  processing: "Procesando",
  failed: "Fallido",
};

function parseShipmentDate(dateStr: string): string {
  // Handles both "21/6/2026" (DD/M/YYYY from real API) and ISO strings (mocks)
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    return d.toLocaleDateString("es-AR");
  }
  return new Date(dateStr).toLocaleDateString("es-AR");
}

export default function ShippingTable({ data, pageSize = 8 }: ShippingTableProps) {
  const columns = [
    {
      header: "ID Envío",
      render: (item: Shipment) => (
        <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
      ),
      className: "text-center w-36 whitespace-nowrap",
    },
    {
      header: "Pedido",
      render: (item: Shipment) => (
        <span className="font-mono text-xs text-muted-foreground">{item.orderId || "—"}</span>
      ),
      className: "text-center hidden md:table-cell w-28",
    },
    {
      header: "Destino",
      render: (item: Shipment) => (
        <span className="text-brown font-medium">{item.destinationCity}</span>
      ),
      className: "text-center",
    },
    {
      header: "Transportista",
      render: (item: Shipment) => (
        <span className="text-muted-foreground">{item.carrier || "—"}</span>
      ),
      className: "text-center hidden lg:table-cell",
    },
    {
      header: "Estado",
      render: (item: Shipment) => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            SHIPMENT_STYLES[item.status] ?? "bg-tan text-brown"
          }`}
        >
          {SHIPMENT_LABELS[item.status] ?? item.status}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Fecha envío",
      render: (item: Shipment) => (
        <span className="text-muted-foreground text-xs">
          {parseShipmentDate(item.createdAt)}
        </span>
      ),
      className: "text-center hidden md:table-cell",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}
