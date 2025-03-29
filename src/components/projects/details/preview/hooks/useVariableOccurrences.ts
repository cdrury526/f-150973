
import { useMemo } from 'react';
import { DOWVariable } from '../../types';

interface VariableOccurrence {
  varName: string;
  value: string;
  startInLine: number;
  endInLine: number;
  isMissing: boolean;
  isHighlighted: boolean;
}

/**
 * Hook to extract and format variable occurrences within a line of text
 */
export const useVariableOccurrences = (
  line: string,
  lineStartPos: number,
  lineEndPos: number,
  variablePositions: any[],
  highlightedVariables: Record<string, boolean>
) => {
  // Find variables that appear in this line
  const varsInLine = useMemo(() => {
    return variablePositions.filter(vp => 
      vp.starts.some(start => 
        start >= lineStartPos && start < lineEndPos
      )
    );
  }, [variablePositions, lineStartPos, lineEndPos]);

  // Process all occurrences in the line
  const allOccurrences = useMemo(() => {
    const occurrences: VariableOccurrence[] = [];
    
    varsInLine.forEach(vp => {
      vp.starts.forEach(start => {
        // Convert global document position to line position
        const startInLine = start - lineStartPos;
        
        // Only include if it starts within this line
        if (startInLine >= 0 && startInLine < line.length) {
          occurrences.push({
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
    occurrences.sort((a, b) => a.startInLine - b.startInLine);
    
    return occurrences;
  }, [varsInLine, lineStartPos, line.length, highlightedVariables]);

  // Handle overlapping occurrences
  const filteredOccurrences = useMemo(() => {
    return allOccurrences.filter((occ, idx, arr) => {
      if (idx === 0) return true;
      
      // Skip if this occurrence overlaps with the previous one
      const prevOcc = arr[idx - 1];
      return occ.startInLine >= prevOcc.endInLine;
    });
  }, [allOccurrences]);

  return {
    varsInLine,
    filteredOccurrences,
    hasVariables: varsInLine.length > 0
  };
};
