
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Building, Calendar, List, Settings, ChevronLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProjectDetailsSidebar from './sidebar/ProjectDetailsSidebar';

// Menu items for the sidebar
const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "Projects",
    icon: Building,
    path: "/projects",
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/calendar",
  },
  {
    title: "Tasks",
    icon: List,
    path: "/tasks",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const AppSidebar = () => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const projectPath = "/project/";
  
  // Check if we're on a project details page
  const isProjectPage = location.pathname.includes(projectPath);
  const projectId = isProjectPage ? location.pathname.split(projectPath)[1] : null;
  
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between py-6 px-4">
        {open ? (
          <>
            <h1 className="text-xl font-bold text-white">Home Build Hub</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)} 
              className="text-white hover:bg-sidebar-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <h1 className="text-xl font-bold text-white">HBH</h1>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{open ? item.title : ""}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {isProjectPage && projectId && (
          <>
            <SidebarSeparator />
            <ProjectDetailsSidebar projectId={projectId} />
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
