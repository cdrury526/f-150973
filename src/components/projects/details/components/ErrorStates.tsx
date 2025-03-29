
/**
 * Error state components for DOW content
 */

import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthWarning from './AuthWarning';

interface TemplateNotFoundProps {
  authError: string | null;
  uploadError: string | null;
  isUploading: boolean;
  onUploadClick: () => void;
}

export const TemplateNotFound: React.FC<TemplateNotFoundProps> = ({ 
  authError, 
  uploadError,
  isUploading,
  onUploadClick
}) => {
  return (
    <div className="p-6 bg-amber-50 border border-amber-200 rounded-md text-amber-800 space-y-4">
      <AuthWarning authError={authError} />
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 text-amber-600" />
        <div>
          <h3 className="text-lg font-medium mb-2">Template Not Found</h3>
          <p className="mb-4">No document template has been uploaded yet. Please upload a markdown template to continue.</p>
        </div>
      </div>
      
      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-4">
        <Button 
          disabled={isUploading || !!authError}
          className="relative overflow-hidden" 
          onClick={onUploadClick}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Template'}
        </Button>
      </div>
    </div>
  );
};

interface AuthErrorProps {
  error: Error;
}

export const AuthError: React.FC<AuthErrorProps> = ({ error }) => {
  return (
    <div className="p-6 bg-destructive/10 border border-destructive rounded-md text-destructive">
      <h3 className="text-lg font-medium mb-2">Authentication Error</h3>
      <p className="mb-4">You don't have permission to access this template.</p>
      <p>{error.message}</p>
      <div className="mt-4">
        <Button 
          variant="default" 
          onClick={() => window.location.href = '/auth/login'}
        >
          <User className="h-4 w-4 mr-2" />
          Log In
        </Button>
      </div>
    </div>
  );
};

interface GeneralErrorProps {
  error: Error | unknown;
  onRetry: () => void;
  onUploadClick: () => void;
  authError: string | null;
}

export const GeneralError: React.FC<GeneralErrorProps> = ({ 
  error, 
  onRetry, 
  onUploadClick,
  authError
}) => {
  return (
    <div className="p-6 bg-destructive/10 border border-destructive rounded-md text-destructive">
      <AuthWarning authError={authError} />
      <h3 className="text-lg font-medium mb-2">Error Loading DOW Content</h3>
      <p>{error instanceof Error ? error.message : "An unknown error occurred"}</p>
      <div className="mt-4 flex gap-4">
        <Button 
          variant="outline" 
          onClick={onRetry}
        >
          Retry
        </Button>
        
        <Button 
          variant="secondary"
          onClick={onUploadClick}
          disabled={!!authError}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload New Template
        </Button>
      </div>
    </div>
  );
};
