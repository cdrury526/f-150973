
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { profile, userRole } = useAuth();

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {profile?.first_name || 'User'}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your {userRole === 'customer' ? 'home building projects' : 'construction projects'}
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {userRole || 'customer'}
          </Badge>
        </div>

        {userRole === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Complete platform overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Admin-specific content will be displayed here.</p>
            </CardContent>
          </Card>
        )}

        {userRole === 'builder' && (
          <Card>
            <CardHeader>
              <CardTitle>Builder Dashboard</CardTitle>
              <CardDescription>Manage your construction projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Builder-specific content will be displayed here.</p>
            </CardContent>
          </Card>
        )}

        {userRole === 'customer' && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Dashboard</CardTitle>
              <CardDescription>Track your home building progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Customer-specific content will be displayed here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
