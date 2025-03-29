
import React from 'react';
import TemplateUpload from './TemplateUpload';
import AuthWarning from './AuthWarning';

interface TemplateUploadSectionProps {
  projectId: string;
  authError: string | null;
  uploadError: string | null;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  setUploadError: (error: string | null) => void;
  setAutoPopulated: (value: boolean) => void;
  onUploadClick: () => void;
}

const TemplateUploadSection: React.FC<TemplateUploadSectionProps> = ({
  authError,
  uploadError,
  isUploading,
  setIsUploading,
  setUploadError,
  setAutoPopulated,
  onUploadClick
}) => {
  return (
    <>
      <AuthWarning authError={authError} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scope of Work Document</h2>
        <TemplateUpload 
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          authError={authError}
          setUploadError={setUploadError}
          setAutoPopulated={setAutoPopulated}
        />
        <input
          id="template-upload"
          type="file"
          accept=".md"
          className="hidden"
          onChange={(e) => {
            if (e.target) {
              const templateUploadInput = e.target as HTMLInputElement;
              if (templateUploadInput.files && templateUploadInput.files.length > 0) {
                const customEvent = {
                  target: templateUploadInput
                } as React.ChangeEvent<HTMLInputElement>;
                
                const templateUploadComponent = document.querySelector('[id^="template-upload"]');
                if (templateUploadComponent) {
                  const changeHandler = (templateUploadComponent as any).onchange;
                  if (changeHandler) {
                    changeHandler(customEvent);
                  }
                }
              }
            }
          }}
          disabled={isUploading || !!authError}
        />
      </div>
    </>
  );
};

export default TemplateUploadSection;
