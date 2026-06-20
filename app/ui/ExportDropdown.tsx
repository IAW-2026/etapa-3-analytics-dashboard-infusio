"use client";

import { useState, useEffect, useRef } from "react";

export default function ExportDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase font-medium text-brown hover:text-terracotta transition-colors"
      >
        Exportar
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-8 bg-white border border-tan rounded-xl shadow-sm z-20 min-w-52 overflow-hidden">
          <a
            href="/api/export?format=csv"
            download
            className="flex items-center gap-2.5 px-4 py-3 text-xs tracking-[0.12em] uppercase text-brown hover:bg-cream transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Descargar CSV
          </a>
          <a
            href="/api/export?format=pdf"
            download
            className="flex items-center gap-2.5 px-4 py-3 text-xs tracking-[0.12em] uppercase text-brown hover:bg-cream transition-colors border-t border-tan/60"
            onClick={() => setOpen(false)}
          >
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Descargar PDF
          </a>
        </div>
      )}
    </div>
  );
}
