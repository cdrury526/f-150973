
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContractorsTable from '@/components/projects/contractors/ContractorsTable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Contractors = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Contractors</h1>
          <p className="text-muted-foreground">
            Manage all your contractors across projects in one place.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contractors Directory</CardTitle>
            <CardDescription>
              View and manage all contractors working on your projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContractorsTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Contractors;
