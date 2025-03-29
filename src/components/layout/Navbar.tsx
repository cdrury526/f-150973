
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Bell, Plus, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, profile, signOut, userRole } = useAuth();
  
  // Generate initials from user's name if available
  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      const firstInitial = profile.first_name ? profile.first_name.charAt(0).toUpperCase() : '';
      const lastInitial = profile.last_name ? profile.last_name.charAt(0).toUpperCase() : '';
      return `${firstInitial}${lastInitial}`;
    }
    // Fallback to email initial if no name is available
    return user?.email?.charAt(0).toUpperCase() || '?';
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
          <Link to="/" className="text-xl font-semibold hidden md:inline-flex">Home Build Hub</Link>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {(userRole === 'builder' || userRole === 'admin') && (
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              )}
              <Button variant="outline" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full p-0 h-10 w-10 overflow-hidden">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {profile?.first_name} {profile?.last_name}
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">Account Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
