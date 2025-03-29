
import React from 'react';
import Navbar from './Navbar';
import AppSidebar from './Sidebar';
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true} className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 transition-all duration-300">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
