
import React from 'react';
import { DOWVariable } from '../types';
import InteractivePreview from './components/InteractivePreview';

interface InteractivePreviewWrapperProps {
  generatedDocument: string;
  templateContent: string;
  variables: DOWVariable[];
  highlightedVariables: Record<string, boolean>;
  onVariableClick: (variableName: string) => void;
}

/**
 * Wrapper component to maintain backward compatibility
 * with existing imports. Delegates to the refactored component.
 */
const InteractivePreviewWrapper: React.FC<InteractivePreviewWrapperProps> = (props) => {
  return <InteractivePreview {...props} />;
};

export default InteractivePreviewWrapper;
