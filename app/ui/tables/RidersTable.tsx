"use client";

import PaginatedTable from "./PaginatedTable";

interface Rider {
  id: string;
  name: string;
  email: string;
}

interface RidersTableProps {
  data: Rider[];
  pageSize?: number;
}

export default function RidersTable({ data, pageSize = 8 }: RidersTableProps) {
  const columns = [
    {
      header: "ID",
      render: (item: Rider) => (
        <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
      ),
      className: "text-center w-48 whitespace-nowrap hidden md:table-cell",
    },
    {
      header: "Nombre",
      render: (item: Rider) => (
        <span className="text-brown font-medium">{item.name}</span>
      ),
      className: "text-left",
    },
    {
      header: "Email",
      render: (item: Rider) => (
        <span className="text-muted-foreground text-xs">{item.email}</span>
      ),
      className: "text-left hidden lg:table-cell",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}
