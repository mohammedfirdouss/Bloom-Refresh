import { ReactNode } from 'react';
import Header from "@/components/common/layout/Header";
import { Sidebar } from "@/components/common/layout/SideBar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </>
  );
}
