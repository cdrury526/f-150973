
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
  missingVariables: string[];
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, missingVariables }) => {
  if (!error && missingVariables.length === 0) {
    return null;
  }

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {missingVariables.length > 0 && (
        <Alert variant="default" className="border-amber-200 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">The following variables are missing values:</p>
            <ul className="list-disc pl-5 mt-2">
              {missingVariables.map((varName) => (
                <li key={varName}>{varName}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ErrorDisplay;
