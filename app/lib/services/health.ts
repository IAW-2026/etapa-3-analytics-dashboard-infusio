export interface ServiceStatus {
  name: string;
  url: string;
  status: "online" | "offline" | "mocked";
  latency: number;
  error?: string;
}

export interface HealthStatus {
  mocksEnabled: boolean;
  timestamp: string;
  services: ServiceStatus[];
}

export async function checkServicesHealth(): Promise<HealthStatus> {
  const isMockEnabled = process.env.ENABLE_MOCKS === "true";

  const services: { name: string; url: string; headers: Record<string, string> }[] = [
    {
      name: "Buyer API",
      url: process.env.BUYER_API_URL || "",
      headers: {
        Authorization: `Bearer ${process.env.BUYER_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
    {
      name: "Seller API",
      url: process.env.SELLER_API_URL ? `${process.env.SELLER_API_URL}/products?limit=1` : "",
      headers: {
        Authorization: `Bearer ${process.env.SELLER_APP_KEY}`,
      },
    },
    {
      name: "Payments API",
      url: process.env.PAYMENTS_API_URL || "",
      headers: {
        "x-api-key": process.env.PAYMENTS_API_KEY || "",
        "Content-Type": "application/json",
      },
    },
    {
      name: "Shipping API",
      url: process.env.SHIPPING_API_URL || "",
      headers: {
        Authorization: `Bearer ${process.env.SHIPPING_API_KEY}`,
      },
    },
  ];

  const results: ServiceStatus[] = [];

  for (const service of services) {
    if (isMockEnabled || !service.url) {
      results.push({
        name: service.name,
        url: service.url || "No configurada",
        status: "mocked",
        latency: 0,
      });
      continue;
    }

    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(service.url, {
        method: "GET",
        headers: service.headers,
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);
      const end = performance.now();
      const latency = Math.round(end - start);

      if (res.ok) {
        results.push({
          name: service.name,
          url: service.url,
          status: "online",
          latency,
        });
      } else {
        results.push({
          name: service.name,
          url: service.url,
          status: "offline",
          latency,
          error: `HTTP ${res.status}: ${res.statusText || "Error"}`,
        });
      }
    } catch (err: any) {
      const end = performance.now();
      const latency = Math.round(end - start);
      results.push({
        name: service.name,
        url: service.url,
        status: "offline",
        latency,
        error: err.name === "AbortError" ? "Timeout (4s)" : err.message || "Error de conexión",
      });
    }
  }

  return {
    mocksEnabled: isMockEnabled,
    timestamp: new Date().toISOString(),
    services: results,
  };
}
