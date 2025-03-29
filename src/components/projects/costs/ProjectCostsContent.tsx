
import React from 'react';
import { CardContent } from "@/components/ui/card";
import ProjectCostsDataTable from './ProjectCostsDataTable';
import ProjectCostsSummary from './ProjectCostsSummary';

interface ProjectCostsContentProps {
  isLoading: boolean;
  costs: any[];
  onEditClick: (cost: any) => void;
  onDeleteClick: (cost: any) => void;
}

const ProjectCostsContent: React.FC<ProjectCostsContentProps> = ({ 
  isLoading, 
  costs, 
  onEditClick, 
  onDeleteClick 
}) => {
  if (isLoading) {
    return (
      <CardContent>
        <div className="text-center py-4">Loading project costs...</div>
      </CardContent>
    );
  }
  
  return (
    <CardContent>
      <ProjectCostsSummary costs={costs} />
      <ProjectCostsDataTable 
        costs={costs || []}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    </CardContent>
  );
};

export default ProjectCostsContent;
