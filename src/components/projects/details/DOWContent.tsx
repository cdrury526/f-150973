/**
 * DOW (Description of Work) Content component
 */

import React from 'react';
import TemplateUploadSection from './components/TemplateUploadSection';
import { TemplateNotFound, AuthError, GeneralError } from './components/ErrorStates';
import DOWLoadingState from './components/DOWLoadingState';
import DocumentEditor from './components/DocumentEditor';
import VariableHighlightStyles from './components/VariableHighlightStyles';
import { useDOWState } from './hooks/useDOWState';
import { DOWVariable } from './types';

interface DOWContentProps {
  projectId: string;
}

/**
 * Main component for the Description of Work (DOW) functionality
 */
const DOWContent: React.FC<DOWContentProps> = ({ projectId }) => {
  const {
    uploadError,
    setUploadError,
    isUploading,
    setIsUploading,
    authError,
    templateQuery,
    variablesQuery,
    handleSave,
    setAutoPopulated,
    handleUploadClick
  } = useDOWState(projectId);

  // Handle saving a single variable
  const handleSaveVariable = (updatedVariable: DOWVariable) => {
    // Find the variable in the existing array
    const updatedVariables = (variablesQuery.data || []).map(v => 
      v.id === updatedVariable.id ? updatedVariable : v
    );
    
    // Save the updated variables
    handleSave(updatedVariables);
  };

  // Loading state
  if (templateQuery.isLoading || variablesQuery.isLoading) {
    return <DOWLoadingState />;
  }

  // Error states
  if (authError) {
    return <AuthError error={new Error(authError)} />;
  }

  if (templateQuery.error) {
    return <TemplateNotFound 
      authError={authError}
      uploadError={uploadError}
      isUploading={isUploading}
      onUploadClick={handleUploadClick}
    />;
  }

  if (variablesQuery.error) {
    return <GeneralError 
      error={variablesQuery.error}
      onRetry={() => variablesQuery.refetch()}
      onUploadClick={handleUploadClick}
      authError={authError}
    />;
  }

  // Empty template state (user hasn't uploaded yet)
  if (!templateQuery.data) {
    return (
      <TemplateUploadSection 
        projectId={projectId}
        authError={authError}
        uploadError={uploadError}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        setUploadError={setUploadError}
        setAutoPopulated={setAutoPopulated}
        onUploadClick={handleUploadClick}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Add the style element with our CSS animation */}
      <VariableHighlightStyles />
      
      <TemplateUploadSection 
        projectId={projectId}
        authError={authError}
        uploadError={uploadError}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        setUploadError={setUploadError}
        setAutoPopulated={setAutoPopulated}
        onUploadClick={handleUploadClick}
      />
      
      <DocumentEditor 
        projectId={projectId}
        variables={variablesQuery.data || []}
        templateContent={templateQuery.data || ''}
        onSaveVariable={handleSaveVariable}
      />
    </div>
  );
};

export default DOWContent;
