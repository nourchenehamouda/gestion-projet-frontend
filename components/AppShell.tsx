"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 px-6 py-10">{children}</div>
      </div>
    </div>
  );
}
