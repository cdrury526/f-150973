
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import AppSidebar from '@/components/layout/Sidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, CheckSquare, Clock, MapPin, User, AlertTriangle } from "lucide-react";
import { sampleProjects } from '@/components/projects/ProjectList';

const statusIcons = {
  'In Progress': <Clock className="h-4 w-4 mr-1" />,
  'Completed': <CheckSquare className="h-4 w-4 mr-1" />,
  'Delayed': <AlertTriangle className="h-4 w-4 mr-1" />,
  'On Hold': <AlertTriangle className="h-4 w-4 mr-1" />
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = sampleProjects.find(p => p.id === id);
  
  if (!project) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1">
            <Navbar />
            <main className="container py-10">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Project not found</h1>
                <Button variant="outline" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container py-6 space-y-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <Badge className="ml-2">
                {statusIcons[project.status]}
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

            <div className="grid gap-6 md:grid-cols-3">
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
              
              <div className="md:col-span-2 space-y-6">
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="prose max-w-none">
                      <h3>Project Description</h3>
                      <p>
                        This project involves the construction of a {project.title.toLowerCase()} located at {project.location}. 
                        The build includes modern amenities and sustainable features to meet the client's specifications.
                      </p>
                      
                      <h3>Key Features</h3>
                      <ul>
                        <li>Energy-efficient design</li>
                        <li>Smart home integration</li>
                        <li>Custom interior finishes</li>
                        <li>Landscaping and outdoor living space</li>
                      </ul>
                      
                      <h3>Project Team</h3>
                      <p>
                        The project is being managed by our senior construction team with specialized contractors 
                        for electrical, plumbing, and finishing work.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="tasks">
                    <p className="text-muted-foreground py-4">Task management will be implemented in the next iteration.</p>
                  </TabsContent>
                  <TabsContent value="timeline">
                    <p className="text-muted-foreground py-4">Project timeline will be implemented in the next iteration.</p>
                  </TabsContent>
                  <TabsContent value="documents">
                    <p className="text-muted-foreground py-4">Document management will be implemented in the next iteration.</p>
                  </TabsContent>
                </Tabs>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { update: "Milestone 3 completed", date: "Oct 15, 2023" },
                        { update: "Updated project timeline", date: "Oct 10, 2023" },
                        { update: "Added new material specifications", date: "Oct 5, 2023" },
                      ].map((item, i) => (
                        <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                          <div className="font-medium">{item.update}</div>
                          <div className="text-sm text-muted-foreground">{item.date}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectDetails;
