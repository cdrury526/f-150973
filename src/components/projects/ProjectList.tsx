
import React from 'react';
import ProjectCard, { Project } from './ProjectCard';

// Sample project data
export const sampleProjects: Project[] = [
  {
    id: "1",
    title: "Modern Residence",
    client: "Johnson Family",
    location: "Brookside Avenue, Portland",
    status: "In Progress",
    progress: 65,
    dueDate: "Dec 15, 2023",
    thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&h=500"
  },
  {
    id: "2",
    title: "Commercial Office Tower",
    client: "TechCorp Inc.",
    location: "Downtown Business District",
    status: "Delayed",
    progress: 30,
    dueDate: "Mar 30, 2024",
    thumbnail: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&h=500"
  },
  {
    id: "3",
    title: "Luxury Villa Renovation",
    client: "Smith Estates",
    location: "Lakeside Drive, Miami",
    status: "Completed",
    progress: 100,
    dueDate: "Oct 10, 2023",
    thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=500"
  },
  {
    id: "4",
    title: "Community Center",
    client: "Westfield Township",
    location: "Park Avenue",
    status: "On Hold",
    progress: 45,
    dueDate: "Jun 22, 2024"
  }
];

interface ProjectListProps {
  projects?: Project[];
  columns?: number;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects = sampleProjects,
  columns = 3
}) => {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-${Math.min(columns, 4)}`}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
