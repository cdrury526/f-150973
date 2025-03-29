
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface RawPreviewProps {
  generatedDocument: string;
}

const RawPreview: React.FC<RawPreviewProps> = ({ generatedDocument }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <Textarea
          value={generatedDocument}
          readOnly
          className="font-mono text-sm min-h-[400px]"
        />
      </CardContent>
    </Card>
  );
};

export default RawPreview;
