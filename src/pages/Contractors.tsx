
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContractorsTable from '@/components/projects/contractors/ContractorsTable';
import { ContractorFormDialog } from '@/components/projects/contractors/ContractorFormDialog';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive } from 'lucide-react';

const Contractors = () => {
  const [activeTab, setActiveTab] = useState<string>("active");

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contractors</h1>
            <p className="text-muted-foreground">
              Manage all your contractors across projects in one place.
            </p>
          </div>
          {activeTab === "active" && <ContractorFormDialog />}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Contractors Directory</CardTitle>
                <CardDescription>
                  View and manage all contractors working on your projects.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Contractors</TabsTrigger>
                <TabsTrigger value="archived" className="flex items-center gap-1">
                  <Archive className="w-4 h-4" />
                  Archived
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <ContractorsTable showArchived={false} />
              </TabsContent>
              <TabsContent value="archived">
                <ContractorsTable showArchived={true} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Contractors;
