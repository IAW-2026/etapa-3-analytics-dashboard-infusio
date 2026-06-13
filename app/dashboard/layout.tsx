import Sidebar from "@/app/ui/Sidebar";
import Header from "@/app/ui/Header";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
