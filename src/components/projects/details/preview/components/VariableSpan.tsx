import React from 'react';

interface VariableSpanProps {
  varName: string;
  value: string;
  isHighlighted: boolean;
  isMissing: boolean;
  onClick: (e: React.MouseEvent, varName: string) => void;
}

const VariableSpan: React.FC<VariableSpanProps> = ({
  varName,
  value,
  isHighlighted,
  isMissing,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default to avoid page navigation, but allow event bubbling
    e.preventDefault();
    
    // Call the onClick handler with the variable name
    onClick(e, varName);
  };

  // Determine styling based on variable state
  const getVariableStyling = () => {
    if (isHighlighted) {
      return 'bg-yellow-100 dark:bg-yellow-900 ring-2 ring-yellow-400 dark:ring-yellow-600';
    }
    
    if (isMissing) {
      // Red/orange for unmodified/empty variables
      return 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300';
    }
    
    // Green for completed variables
    return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
  };

  return (
    <span 
      className={`
        cursor-pointer px-1 rounded-md border 
        ${getVariableStyling()}
        transition-all duration-150
      `}
      onClick={handleClick}
      title={`Click to edit ${varName}${isMissing ? " (needs to be filled in)" : " (already filled)"}`}
    >
      {value}
    </span>
  );
};

export default VariableSpan;
