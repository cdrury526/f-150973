
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/components/projects/ProjectCard';

interface StatusIconsMap {
  [key: string]: React.ReactNode;
}

const statusIcons: StatusIconsMap = {
  'In Progress': <Clock className="h-4 w-4 mr-1" />,
  'Completed': <CheckSquare className="h-4 w-4 mr-1" />,
  'Delayed': <AlertTriangle className="h-4 w-4 mr-1" />,
  'On Hold': <AlertTriangle className="h-4 w-4 mr-1" />,
  'Not Started': <Clock className="h-4 w-4 mr-1" />
};

import { Clock, CheckSquare, AlertTriangle } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project & { projectType: string };
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <Badge className="ml-2 flex items-center">
          {statusIcons[project.status] || <Clock className="h-4 w-4 mr-1" />}
          {project.status}
        </Badge>
      </div>

      {project.thumbnail && (
        <div className="w-full h-64 overflow-hidden rounded-lg">
          <img 
            src={project.thumbnail} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );
};

export default ProjectHeader;
