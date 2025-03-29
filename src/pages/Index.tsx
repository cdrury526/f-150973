
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import AppSidebar from '@/components/layout/Sidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ProjectList from '@/components/projects/ProjectList';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Building, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container py-6 space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            
            <DashboardStats />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Projects</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <ProjectList columns={3} />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
                <div className="rounded-lg border">
                  <div className="p-4 space-y-3">
                    {[
                      { project: "Modern Residence", date: "Dec 15, 2023" },
                      { project: "Community Center", date: "Jun 22, 2024" },
                      { project: "Commercial Office Tower", date: "Mar 30, 2024" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{item.project}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <div className="rounded-lg border">
                  <div className="p-4 space-y-3">
                    {[
                      { activity: "New task added to Modern Residence", time: "2 hours ago" },
                      { activity: "Completed milestone for Luxury Villa", time: "Yesterday" },
                      { activity: "Project status updated for Commercial Tower", time: "2 days ago" },
                      { activity: "New comment on Community Center", time: "3 days ago" },
                    ].map((item, i) => (
                      <div key={i} className="py-2 border-b last:border-0">
                        <div>{item.activity}</div>
                        <div className="text-sm text-muted-foreground">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
