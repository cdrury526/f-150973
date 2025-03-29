
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CheckSquare, Calendar, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`text-xs mt-1 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Projects"
        value="8"
        description="Total running projects"
        icon={<Building className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "12% from last month", positive: true }}
      />
      <StatCard
        title="Completed Tasks"
        value="24"
        description="Tasks completed this week"
        icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "4% from last week", positive: true }}
      />
      <StatCard
        title="Upcoming Deadlines"
        value="3"
        description="Projects due this month"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Issues Reported"
        value="5"
        description="Open issues to address"
        icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "2% from last week", positive: false }}
      />
    </div>
  );
};

export default DashboardStats;
