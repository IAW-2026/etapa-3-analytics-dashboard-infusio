import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClientLayout from "./dashboardClientLayout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const roles = (user?.publicMetadata?.roles as string[] | undefined) ?? [];
  if (!roles.includes("admin")) {
    redirect("/unauthorized");
  }

  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
