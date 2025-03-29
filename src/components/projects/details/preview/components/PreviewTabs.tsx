
import React from 'react';
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
  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="raw">Raw</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <Card>
          <CardContent className="p-4 max-h-[500px] overflow-y-auto">
            <div className="prose max-w-none break-words whitespace-pre-wrap">
              <InteractivePreview 
                generatedDocument={generatedDocument}
                templateContent={templateContent}
                variables={variables}
                highlightedVariables={highlightedVariables}
                onVariableClick={onVariableClick}
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
