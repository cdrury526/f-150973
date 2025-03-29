import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DOWVariable } from '../../types';
import InteractivePreview from './InteractivePreview';
import RawPreview from './RawPreview';

interface PreviewTabsProps {
  generatedDocument: string;
  templateContent: string;
  variables: DOWVariable[];
  highlightedVariables: Record<string, boolean>;
  onVariableClick: (variableName: string) => void;
}

const PreviewTabs: React.FC<PreviewTabsProps> = ({
  generatedDocument,
  templateContent, 
  variables,
  highlightedVariables,
  onVariableClick
}) => {
  const previewContentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  // Capture scroll position changes initiated by the user
  useEffect(() => {
    const handleScroll = () => {
      if (isUserScrolling && previewContentRef.current) {
        scrollPositionRef.current = previewContentRef.current.scrollTop;
      }
    };
    
    const handleMouseDown = () => setIsUserScrolling(true);
    const handleMouseUp = () => {
      // Short delay before marking scrolling as done
      setTimeout(() => setIsUserScrolling(false), 100);
    };
    
    const contentElement = previewContentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      contentElement.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
        contentElement.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isUserScrolling]);
  
  // Preserve scroll position across renders
  useEffect(() => {
    if (previewContentRef.current && !isUserScrolling) {
      // Only restore if we have a saved position and not actively scrolling
      if (scrollPositionRef.current > 0) {
        previewContentRef.current.scrollTop = scrollPositionRef.current;
      }
    }
  });
  
  // Custom click handler to preserve scroll position
  const handleVariableClick = (varName: string) => {
    // Save current scroll position before click is processed
    if (previewContentRef.current) {
      scrollPositionRef.current = previewContentRef.current.scrollTop;
    }
    
    // Call the original handler
    onVariableClick(varName);
    
    // Schedule multiple scroll restorations after click
    [10, 50, 100, 300].forEach(delay => {
      setTimeout(() => {
        if (previewContentRef.current && !isUserScrolling) {
          previewContentRef.current.scrollTop = scrollPositionRef.current;
        }
      }, delay);
    });
  };

  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="raw">Raw</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <Card>
          <CardContent 
            ref={previewContentRef}
            className="p-4 max-h-[500px] overflow-y-auto preview-container"
          >
            <div className="prose max-w-none break-words whitespace-pre-wrap">
              <InteractivePreview 
                generatedDocument={generatedDocument}
                templateContent={templateContent}
                variables={variables}
                highlightedVariables={highlightedVariables}
                onVariableClick={handleVariableClick}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="raw">
        <RawPreview 
          generatedDocument={generatedDocument} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default PreviewTabs;
