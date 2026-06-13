const APP_STYLES: Record<string, string> = {
  buyer: "bg-terracotta/10 text-terracotta",
  seller: "bg-olive/10 text-olive",
  shipping: "bg-sky-100 text-sky-700",
  payments: "bg-purple-100 text-purple-700",
};

const APP_LABELS: Record<string, string> = {
  buyer: "Buyer App",
  seller: "Seller App",
  shipping: "Shipping App",
  payments: "Payments App",
};

interface AppBadgeProps {
  source: string;
}

export default function AppBadge({ source }: AppBadgeProps) {
  const style = APP_STYLES[source] ?? "bg-tan text-brown";
  const label = APP_LABELS[source] ?? source;
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${style}`}>
      {label}
    </span>
  );
}
