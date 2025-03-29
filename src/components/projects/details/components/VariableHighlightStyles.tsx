
import React from 'react';

const VariableHighlightStyles: React.FC = () => {
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

  return <style dangerouslySetInnerHTML={{ __html: pulseAnimationStyle }} />;
};

export default VariableHighlightStyles;
