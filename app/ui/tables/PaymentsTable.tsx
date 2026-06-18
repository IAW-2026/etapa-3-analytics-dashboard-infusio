"use client";

import React from "react";
import PaginatedTable from "./PaginatedTable";

interface PaymentOrder {
  id: string;
  userName: string; // Shows buyerId
  reason: string;   // Shows purchase order label or notes
  status: string;   // accepted, pending, cancelled
  amount: number;
  openedAt: string; // createdAt
}

interface PaymentsTableProps {
  data: PaymentOrder[];
  pageSize?: number;
}

const PAYMENT_STYLES: Record<string, string> = {
  accepted: "bg-olive/10 text-olive",
  pending: "bg-yellow-50 text-yellow-700",
  cancelled: "bg-red-50 text-red-700",
};

const PAYMENT_LABELS: Record<string, string> = {
  accepted: "Aceptado",
  pending: "Pendiente",
  cancelled: "Cancelado",
};

export default function PaymentsTable({ data, pageSize = 8 }: PaymentsTableProps) {
  const columns = [
    {
      header: "ID Pago",
      render: (item: PaymentOrder) => (
        <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
      ),
      className: "text-center w-36 whitespace-nowrap",
    },
    {
      header: "Comprador",
      render: (item: PaymentOrder) => (
        <span className="text-brown font-medium text-xs break-all">{item.userName}</span>
      ),
      className: "text-center",
    },
    {
      header: "Orden de compra",
      render: (item: PaymentOrder) => (
        <span className="text-muted-foreground">{item.reason}</span>
      ),
      className: "text-center hidden md:table-cell",
    },
    {
      header: "Estado",
      render: (item: PaymentOrder) => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            PAYMENT_STYLES[item.status] ?? "bg-tan text-brown"
          }`}
        >
          {PAYMENT_LABELS[item.status] ?? item.status}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Monto",
      render: (item: PaymentOrder) => (
        <span className="font-medium text-brown">
          ${item.amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Fecha",
      render: (item: PaymentOrder) => (
        <span className="text-muted-foreground text-xs">
          {new Date(item.openedAt).toLocaleDateString("es-AR")}
        </span>
      ),
      className: "text-center hidden lg:table-cell",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}
