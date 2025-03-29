
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface ProjectCostsHeaderProps {
  onAddCategoryClick: () => void;
}

const ProjectCostsHeader: React.FC<ProjectCostsHeaderProps> = ({ onAddCategoryClick }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">Project Costs</CardTitle>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddCategoryClick}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Category
      </Button>
    </CardHeader>
  );
};

export default ProjectCostsHeader;
