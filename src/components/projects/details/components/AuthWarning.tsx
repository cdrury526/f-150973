
/**
 * Authentication warning component
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "lucide-react";

interface AuthWarningProps {
  authError: string | null;
}

const AuthWarning: React.FC<AuthWarningProps> = ({ authError }) => {
  if (!authError) return null;
  
  return (
    <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
      <User className="h-4 w-4" />
      <AlertTitle>Authentication Notice</AlertTitle>
      <AlertDescription>{authError}</AlertDescription>
    </Alert>
  );
};

export default AuthWarning;
