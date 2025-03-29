
import React from 'react';

interface VariableSpanProps {
  varName: string;
  value: string;
  isHighlighted: boolean;
  onClick: (e: React.MouseEvent, varName: string) => void;
}

const VariableSpan: React.FC<VariableSpanProps> = ({
  varName,
  value,
  isHighlighted,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default to stop scrolling but allow propagation
    e.preventDefault();
    
    // Stop propagation within preview but don't prevent default
    e.stopPropagation();
    
    // Call the onClick handler with the variable name
    onClick(e, varName);
  };

  return (
    <span 
      className={`
        cursor-pointer px-1 rounded-md border 
        ${isHighlighted ? 
          'bg-yellow-100 dark:bg-yellow-900 ring-2 ring-yellow-400 dark:ring-yellow-600' : 
          'hover:bg-yellow-50 dark:hover:bg-yellow-950 hover:border-yellow-200'
        }
        transition-all duration-150
      `}
      onClick={handleClick}
      title={`Click to edit ${varName}`}
    >
      {value}
    </span>
  );
};

export default VariableSpan;
