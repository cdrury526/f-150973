
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const DOWLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

export default DOWLoadingState;
