
import React from 'react';
import VariableSpan from './VariableSpan';
import { useVariableOccurrences } from '../hooks/useVariableOccurrences';

interface DocumentLineProps {
  line: string;
  lineIdx: number;
  lineStartPos: number;
  lineEndPos: number;
  variablePositions: any[];
  highlightedVariables: Record<string, boolean>;
  onVariableClick: (e: React.MouseEvent, varName: string) => void;
}

const DocumentLine: React.FC<DocumentLineProps> = ({
  line,
  lineIdx,
  lineStartPos,
  lineEndPos,
  variablePositions,
  highlightedVariables,
  onVariableClick
}) => {
  // If the line is empty, render a line break
  if (!line.trim()) return <br key={`line-${lineIdx}`} />;
  
  // Use our custom hook to get variable occurrences
  const { filteredOccurrences, hasVariables } = useVariableOccurrences(
    line,
    lineStartPos,
    lineEndPos,
    variablePositions,
    highlightedVariables
  );
  
  // If no variables in this line, just render the line as is
  if (!hasVariables) {
    return <div className="py-1">{line}</div>;
  }

  // Create segments of text and interactive spans
  const segments: React.ReactNode[] = [];
  
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
      <VariableSpan
        key={`var-${occ.varName}-${idx}`}
        varName={occ.varName}
        value={occ.value}
        isHighlighted={occ.isHighlighted}
        onClick={onVariableClick}
      />
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
      className={`py-1 ${hasHighlightedVars ? 'pl-2 border-l-2 border-yellow-300' : ''}`}
    >
      {segments}
    </div>
  );
};

export default DocumentLine;
