"use client";

import React, { useState } from "react";

interface Column<T> {
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface PaginatedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

export default function PaginatedTable<T>({
  data,
  columns,
  pageSize = 8,
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-tan">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, itemIdx) => (
              <tr
                key={itemIdx}
                className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-6 py-4 text-brown ${col.className || ""}`}>
                    {col.render(item, startIndex + itemIdx)}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-muted-foreground">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
            <span className="font-medium">{Math.min(endIndex, data.length)}</span> de{" "}
            <span className="font-medium">{data.length}</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-tan text-brown bg-white hover:bg-cream disabled:opacity-50 disabled:pointer-events-none transition-colors"
              aria-label="Página anterior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-xs font-medium text-brown min-w-[80px] text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-tan text-brown bg-white hover:bg-cream disabled:opacity-50 disabled:pointer-events-none transition-colors"
              aria-label="Página siguiente"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
