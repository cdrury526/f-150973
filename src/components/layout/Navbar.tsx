
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Bell, User, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
          <span className="text-xl font-semibold hidden md:inline-flex">Home Build Hub</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
