
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, AlertTriangle } from "lucide-react";
import { Link } from 'react-router-dom';

// Status badge color mapping
const statusColors = {
  'In Progress': {
    color: 'bg-blue-100 text-blue-800',
    icon: <Clock className="h-3 w-3 mr-1" />
  },
  'Completed': { 
    color: 'bg-green-100 text-green-800',
    icon: <Check className="h-3 w-3 mr-1" />
  },
  'Delayed': {
    color: 'bg-amber-100 text-amber-800',
    icon: <AlertTriangle className="h-3 w-3 mr-1" />
  },
  'On Hold': {
    color: 'bg-gray-100 text-gray-800',
    icon: <AlertTriangle className="h-3 w-3 mr-1" />
  }
};

export interface Project {
  id: string;
  title: string;
  client: string;
  location: string;
  status: 'In Progress' | 'Completed' | 'Delayed' | 'On Hold';
  progress: number;
  dueDate: string;
  thumbnail?: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { id, title, client, location, status, progress, dueDate, thumbnail } = project;
  const statusStyle = statusColors[status] || { color: 'bg-gray-100 text-gray-800', icon: null };

  return (
    <Card className="overflow-hidden">
      {thumbnail && (
        <div className="h-36 w-full overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{client}</p>
          </div>
          <Badge className={`flex items-center ${statusStyle.color}`}>
            {statusStyle.icon}
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Location:</span> {location}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Due:</span> {dueDate}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/project/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
