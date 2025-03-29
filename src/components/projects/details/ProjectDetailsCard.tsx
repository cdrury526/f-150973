
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Calendar, CheckSquare } from 'lucide-react';
import { Project } from '@/components/projects/ProjectCard';

interface ProjectDetailsCardProps {
  project: Project & { projectType: string };
}

const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Client:</span> 
            <span className="ml-1 font-medium">{project.client}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Location:</span> 
            <span className="ml-1 font-medium">{project.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Due Date:</span> 
            <span className="ml-1 font-medium">{project.dueDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <CheckSquare className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Type:</span> 
            <span className="ml-1 font-medium">{project.projectType}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button className="w-full">Edit Project</Button>
          <Button variant="outline" className="w-full">Download Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetailsCard;
