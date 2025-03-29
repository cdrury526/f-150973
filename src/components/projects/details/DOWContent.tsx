
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

interface DOWContentProps {
  projectId: string;
}

const DOWContent: React.FC<DOWContentProps> = ({ projectId }) => {
  const {
    uploadError,
    setUploadError,
    isUploading,
    setIsUploading,
    authError,
    activeVariableName,
    formRef,
    templateQuery,
    variablesQuery,
    handleSave,
    setAutoPopulated,
    getSortedVariables,
    handleVariableClick,
    handleUploadClick
  } = useDOWState(projectId);

  // Loading state
  if (templateQuery.isLoading || variablesQuery.isLoading) {
    return <DOWLoadingState />;
  }

  // Template not found error state (specific case for first-time setup)
  if (templateQuery.error && templateQuery.error instanceof Error && 
      templateQuery.error.message.includes('Template not found')) {
    return (
      <TemplateNotFound 
        authError={authError}
        uploadError={uploadError}
        isUploading={isUploading}
        onUploadClick={handleUploadClick}
      />
    );
  }

  // Authentication specific error state
  if (templateQuery.error && templateQuery.error instanceof Error && 
      (templateQuery.error.message.includes('Permission denied') || 
       templateQuery.error.message.includes('not authorized') ||
       templateQuery.error.message.includes('authentication'))) {
    return <AuthError error={templateQuery.error} />;
  }

  // General error state
  if (templateQuery.error || variablesQuery.error) {
    return (
      <GeneralError 
        error={templateQuery.error || variablesQuery.error}
        onRetry={() => {
          templateQuery.refetch();
          variablesQuery.refetch();
        }}
        onUploadClick={handleUploadClick}
        authError={authError}
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
        activeVariableName={activeVariableName}
        formRef={formRef}
        onVariableClick={handleVariableClick}
        onSave={handleSave}
        getSortedVariables={getSortedVariables}
      />
    </div>
  );
};

export default DOWContent;
