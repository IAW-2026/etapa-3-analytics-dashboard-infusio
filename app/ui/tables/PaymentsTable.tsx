"use client";

import React from "react";
import PaginatedTable from "./PaginatedTable";

interface Dispute {
  id: string;
  userName: string;
  reason: string;
  status: string;
  amount: number;
  openedAt: string;
}

interface PaymentsTableProps {
  data: Dispute[];
  pageSize?: number;
}

const DISPUTE_STYLES: Record<string, string> = {
  open: "bg-yellow-50 text-yellow-700",
  resolved: "bg-olive/10 text-olive",
  rejected: "bg-red-50 text-red-700",
};

const DISPUTE_LABELS: Record<string, string> = {
  open: "Abierta",
  resolved: "Resuelta",
  rejected: "Rechazada",
};

export default function PaymentsTable({ data, pageSize = 8 }: PaymentsTableProps) {
  const columns = [
    {
      header: "ID",
      render: (item: Dispute) => (
        <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
      ),
      className: "text-left w-24",
    },
    {
      header: "Cliente",
      render: (item: Dispute) => (
        <span className="text-brown font-medium">{item.userName}</span>
      ),
      className: "text-left",
    },
    {
      header: "Motivo",
      render: (item: Dispute) => (
        <span className="text-muted-foreground">{item.reason}</span>
      ),
      className: "text-left hidden md:table-cell",
    },
    {
      header: "Estado",
      render: (item: Dispute) => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            DISPUTE_STYLES[item.status] ?? "bg-tan text-brown"
          }`}
        >
          {DISPUTE_LABELS[item.status] ?? item.status}
        </span>
      ),
      className: "text-left",
    },
    {
      header: "Monto",
      render: (item: Dispute) => (
        <span className="font-medium text-brown">
          ${item.amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      ),
      className: "text-right",
    },
    {
      header: "Apertura",
      render: (item: Dispute) => (
        <span className="text-muted-foreground text-xs">
          {new Date(item.openedAt).toLocaleDateString("es-AR")}
        </span>
      ),
      className: "text-right hidden lg:table-cell",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}
