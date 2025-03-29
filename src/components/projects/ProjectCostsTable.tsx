
import React from 'react';
import ProjectCostsContainer from './costs/ProjectCostsContainer';

interface ProjectCostsTableProps {
  projectId: string;
}

const ProjectCostsTable: React.FC<ProjectCostsTableProps> = ({ projectId }) => {
  return <ProjectCostsContainer projectId={projectId} />;
};

export default ProjectCostsTable;
