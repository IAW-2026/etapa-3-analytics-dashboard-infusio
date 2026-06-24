"use client";

import React, { useRef, useState, useEffect } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  /** Height of the placeholder before load (prevents CLS) */
  minHeight?: number;
  /** How many pixels before entering viewport to start loading */
  rootMargin?: string;
  /** Fallback skeleton shown before the section enters viewport */
  fallback?: React.ReactNode;
}

/**
 * Defers rendering of children until the section is near the viewport.
 * Reduces TBT on mobile by avoiding parsing heavy chart JS upfront.
 */
export default function LazySection({
  children,
  minHeight = 200,
  rootMargin = "200px",
  fallback,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {visible
        ? children
        : fallback ?? (
            <div
              className="bg-white rounded-2xl border border-tan p-6 shadow-sm animate-pulse"
              style={{ minHeight }}
            >
              <div className="h-4 w-32 bg-muted rounded mb-2" />
              <div className="h-3 w-20 bg-muted/50 rounded mb-6" />
              <div
                className="w-full bg-muted/30 rounded-xl"
                style={{ height: minHeight - 80 }}
              />
            </div>
          )}
    </div>
  );
}
