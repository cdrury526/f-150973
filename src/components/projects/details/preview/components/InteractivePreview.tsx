
import React, { useCallback } from 'react';
import { DOWVariable } from '../../types';
import { findVariablesInDocument } from '../utils/variableUtils';

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
    const linePositions = lines.reduce<number[]>((positions, line, index) => {
      const prevPosition = index > 0 ? positions[index - 1] + lines[index - 1].length + 1 : 0;
      positions.push(prevPosition);
      return positions;
    }, []);
    
    return (
      <div className="space-y-1">
        {/* Add the style element with our CSS animation */}
        <style dangerouslySetInnerHTML={{ __html: pulseAnimationStyle }} />
        
        {lines.map((line, lineIdx) => {
          if (!line.trim()) return <br key={`line-${lineIdx}`} />;
          
          // Calculate the start and end positions of this line in the document
          const lineStartPos = linePositions[lineIdx];
          const lineEndPos = lineStartPos + line.length;
          
          // Find variables that appear in this line
          const varsInLine = variablePositions.filter(vp => 
            vp.starts.some(start => 
              start >= lineStartPos && start < lineEndPos
            )
          );
          
          // If no variables in this line, just render the line as is
          if (varsInLine.length === 0) {
            return <div key={`line-${lineIdx}`} className="py-1">{line}</div>;
          }
          
          // Create segments of text and interactive spans
          const segments: React.ReactNode[] = [];
          let currentPos = 0; // Position within the line
          
          // Sort all variable occurrences in this line by their start position
          const allOccurrences: Array<{
            varName: string,
            value: string,
            startInLine: number,
            endInLine: number,
            isMissing: boolean,
            isHighlighted: boolean
          }> = [];
          
          varsInLine.forEach(vp => {
            vp.starts.forEach(start => {
              // Convert global document position to line position
              const startInLine = start - lineStartPos;
              
              // Only include if it starts within this line
              if (startInLine >= 0 && startInLine < line.length) {
                allOccurrences.push({
                  varName: vp.varName,
                  value: vp.value,
                  startInLine,
                  endInLine: startInLine + vp.value.length,
                  isMissing: vp.isMissing,
                  isHighlighted: highlightedVariables[vp.varName] || false
                });
              }
            });
          });
          
          // Sort by start position
          allOccurrences.sort((a, b) => a.startInLine - b.startInLine);
          
          // Handle overlapping occurrences (should be rare, but possible)
          const filteredOccurrences = allOccurrences.filter((occ, idx, arr) => {
            if (idx === 0) return true;
            
            // Skip if this occurrence overlaps with the previous one
            const prevOcc = arr[idx - 1];
            return occ.startInLine >= prevOcc.endInLine;
          });
          
          // Create segments
          let lastEnd = 0;
          filteredOccurrences.forEach((occ, idx) => {
            // Add text before this variable
            if (occ.startInLine > lastEnd) {
              segments.push(
                <span key={`text-${lineIdx}-${idx}`}>
                  {line.substring(lastEnd, occ.startInLine)}
                </span>
              );
            }
            
            // Add the clickable variable span
            segments.push(
              <span 
                key={`var-${occ.varName}-${idx}`}
                className={`
                  cursor-pointer px-1 rounded-md border 
                  ${occ.isHighlighted ? 
                    'bg-yellow-100 dark:bg-yellow-900 ring-2 ring-yellow-400 dark:ring-yellow-600' : 
                    'hover:bg-yellow-50 dark:hover:bg-yellow-950 hover:border-yellow-200'
                  }
                  transition-all duration-150
                `}
                onClick={(e) => handleVariableClick(e, occ.varName)}
                title={`Click to edit ${occ.varName}`}
              >
                {occ.value}
              </span>
            );
            
            lastEnd = occ.endInLine;
          });
          
          // Add any remaining text after the last variable
          if (lastEnd < line.length) {
            segments.push(
              <span key={`text-${lineIdx}-end`}>
                {line.substring(lastEnd)}
              </span>
            );
          }
          
          // Show a highlight for lines with active variables
          const hasHighlightedVars = filteredOccurrences.some(occ => occ.isHighlighted);
          
          return (
            <div 
              key={`line-${lineIdx}`} 
              className={`py-1 ${hasHighlightedVars ? 'pl-2 border-l-2 border-yellow-300' : ''}`}
            >
              {segments}
            </div>
          );
        })}
      </div>
    );
  }, [generatedDocument, templateContent, variables, highlightedVariables, handleVariableClick]);

  return renderDocumentWithInteractiveVariables();
};

export default InteractivePreview;
