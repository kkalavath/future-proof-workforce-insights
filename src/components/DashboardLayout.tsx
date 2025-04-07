
import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="min-h-screen flex w-full bg-dashboard-background">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-dashboard-text">{title}</h1>
            {subtitle && <p className="text-dashboard-muted">{subtitle}</p>}
          </div>
          <SidebarTrigger className="md:hidden" />
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
