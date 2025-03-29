
import React, { useCallback } from 'react';
import { DOWVariable } from '../../types';
import { findVariablesInDocument } from '../utils/variableUtils';
import DocumentLine from './DocumentLine';

// Add the CSS for variable highlighting
const pulseAnimationStyle = `
  .variable-highlight-pulse {
    animation: pulse-highlight 1.5s ease-in-out;
  }

  @keyframes pulse-highlight {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); 
      border-color: var(--border);
    }
    25% { 
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5); 
      border-color: rgb(59, 130, 246);
    }
    75% { 
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); 
      border-color: rgb(59, 130, 246);
    }
  }
`;

interface InteractivePreviewProps {
  generatedDocument: string;
  templateContent: string;
  variables: DOWVariable[];
  highlightedVariables: Record<string, boolean>;
  onVariableClick: (variableName: string) => void;
}

const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  generatedDocument,
  templateContent,
  variables,
  highlightedVariables,
  onVariableClick,
}) => {
  const handleVariableClick = useCallback((e: React.MouseEvent, varName: string) => {
    // Prevent default browser behavior (like scrolling to top)
    e.preventDefault();
    e.stopPropagation();
    
    // Call the provided click handler
    onVariableClick(varName);
    
    // Return false to prevent any other default behaviors
    return false;
  }, [onVariableClick]);

  // Calculate line positions for the document
  const calculateLinePositions = useCallback((lines: string[]) => {
    return lines.reduce<number[]>((positions, line, index) => {
      const prevPosition = index > 0 ? positions[index - 1] + lines[index - 1].length + 1 : 0;
      positions.push(prevPosition);
      return positions;
    }, []);
  }, []);

  const renderDocumentWithInteractiveVariables = useCallback(() => {
    if (!templateContent) return <p>No template content available.</p>;
    
    // Find variables with their positions in the document
    const variablePositions = findVariablesInDocument(
      generatedDocument, 
      templateContent, 
      variables
    );
    
    // Split the document by lines to maintain formatting
    const lines = generatedDocument.split('\n');
    
    // Calculate positions of lines in the document
    const linePositions = calculateLinePositions(lines);
    
    return (
      <div className="space-y-1">
        {/* Add the style element with our CSS animation */}
        <style dangerouslySetInnerHTML={{ __html: pulseAnimationStyle }} />
        
        {lines.map((line, lineIdx) => (
          <DocumentLine 
            key={`line-${lineIdx}`}
            line={line}
            lineIdx={lineIdx}
            lineStartPos={linePositions[lineIdx]}
            lineEndPos={linePositions[lineIdx] + line.length}
            variablePositions={variablePositions}
            highlightedVariables={highlightedVariables}
            onVariableClick={handleVariableClick}
          />
        ))}
      </div>
    );
  }, [generatedDocument, templateContent, variables, highlightedVariables, handleVariableClick, calculateLinePositions]);

  return renderDocumentWithInteractiveVariables();
};

export default InteractivePreview;
