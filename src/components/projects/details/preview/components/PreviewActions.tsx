import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Copy, FileText, File } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DOWVariable } from '../../types';

interface PreviewActionsProps {
  generatedDocument: string;
  variables?: DOWVariable[]; // Array of variables for highlighting
}

interface Marker {
  start: number;
  end: number;
  value: string;
  name: string;
}

const PreviewActions: React.FC<PreviewActionsProps> = ({ generatedDocument, variables = [] }) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [boldVariables, setBoldVariables] = useState(false);
  
  // Handle toggling bold variables with toast notification
  const handleToggleBoldVariables = (checked: boolean) => {
    setBoldVariables(checked);
    toast({
      title: checked ? "Variables will be bold" : "Variables will not be bold",
      description: checked 
        ? "Variable values will appear bold in downloaded documents" 
        : "Variable values will appear normal in downloaded documents",
    });
  };
  
  // Process variables for text with both values and placeholders
  const processVariablesForBold = (text: string, variables: DOWVariable[]) => {
    const boldVariables = variables.filter(v => v.value && v.value.trim() !== '');
    
    // Process each variable that has a value - look for matches in the text
    const sortedVariables = [...variables].sort((a, b) => 
      (b.value?.length || 0) - (a.value?.length || 0)
    );
    
    let modifiedText = text;
    let markers: Marker[] = [];
    
    for (const variable of sortedVariables) {
      if (!variable.value || variable.value.trim() === '') continue;
      
      const cleanValue = variable.value.trim();
      
      // Find all occurrences of this variable value in text
      let match;
      const regex = new RegExp(escapeRegExp(cleanValue), 'gi');
      
      while ((match = regex.exec(modifiedText)) !== null) {
        markers.push({
          start: match.index,
          end: match.index + cleanValue.length,
          value: cleanValue,
          name: variable.name
        });
      }
    }
    
    // Also look for placeholder patterns in the text
    for (const variable of variables) {
      // Standard placeholder pattern
      const pattern = `{{${variable.name}}}`;
      const index = modifiedText.indexOf(pattern);
      
      if (index !== -1) {
        markers.push({
          start: index,
          end: index + pattern.length,
          value: pattern,
          name: variable.name
        });
      }
    }
    
    return { text: modifiedText, markers };
  };
  
  // Escape regex special characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Document content has been copied to clipboard",
        });
      },
      (err) => {
        console.error('Copy failed:', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([generatedDocument], { type: 'text/markdown' });
    saveAs(blob, 'scope-of-work.md');
  };

  const downloadAsText = () => {
    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    saveAs(blob, 'scope-of-work.txt');
  };

  // Helper function to preserve indentation and line formatting 
  const preserveFormatting = (text: string) => {
    // Replace multiple spaces with non-breaking spaces to preserve indentation
    return text.replace(/( {2,})/g, (match) => {
      return '\u00A0'.repeat(match.length);
    });
  };

  const downloadAsPDF = async () => {
    try {
      setIsDownloading(true);
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set font size smaller
      doc.setFontSize(10);
      
      // Define margins
      const margin = 20; // 20mm margins
      const pageWidth = doc.internal.pageSize.getWidth() - (margin * 2);
      const pageHeight = doc.internal.pageSize.getHeight() - (margin * 2);
      
      // Process content for variables if needed
      const processedContent = processVariablesForBold(generatedDocument, variables);
      
      // Split content by paragraphs, preserving line breaks
      // First split by true paragraphs (double line breaks)
      const paragraphs = processedContent.text.split(/\n\s*\n/);
      
      // Initial position
      let y = margin;
      const lineHeight = 5; // Decreased line height
      
      // Process each paragraph
      for (const paragraph of paragraphs) {
        // Skip empty paragraphs
        if (!paragraph.trim()) {
          y += lineHeight;
          continue;
        }
        
        // Split paragraph into lines to preserve single line breaks
        const lines = paragraph.split('\n');
        
        // Check if this paragraph contains variable markers
        if (boldVariables && paragraph.includes('__VAR_BOLD_')) {
          // Find all marker positions in this paragraph
          const markerPositions = [];
          
          // Process each line in the paragraph
          for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = preserveFormatting(lines[lineIndex]);
            let currentText = line;
            let currentY = y + (lineHeight * lineIndex);
            
            // Skip page if needed
            if (currentY > pageHeight - 10) {
              doc.addPage();
              currentY = margin;
              y = margin - (lineHeight * lineIndex);
            }
            
            // Find all markers in this line
            const lineMarkerPositions = [];
            for (const variable of variables) {
              const marker = `__VAR_BOLD_${variable.name}__`;
              let startIndex = 0;
              
              while ((startIndex = currentText.indexOf(marker, startIndex)) !== -1) {
                lineMarkerPositions.push({
                  start: startIndex,
                  end: startIndex + marker.length,
                  marker,
                  variableName: variable.name,
                  value: variable.value || variable.name
                });
                startIndex += marker.length;
              }
            }
            
            // Sort marker positions by their start index
            lineMarkerPositions.sort((a, b) => a.start - b.start);
            
            // If no markers were found, render the line normally
            if (lineMarkerPositions.length === 0) {
              doc.setFont(undefined, 'normal');
              doc.text(currentText, margin, currentY);
              continue;
            }
            
            // Process text sections with appropriate bold formatting
            let lastIndex = 0;
            
            // Process each section (between markers and the markers themselves)
            for (let i = 0; i < lineMarkerPositions.length; i++) {
              const pos = lineMarkerPositions[i];
              
              // Process text before this marker
              if (pos.start > lastIndex) {
                const beforeText = currentText.substring(lastIndex, pos.start);
                if (beforeText) {
                  doc.setFont(undefined, 'normal');
                  doc.text(beforeText, margin + doc.getStringUnitWidth(currentText.substring(0, lastIndex)) * 2.5, currentY);
                }
              }
              
              // Process the variable value (bold)
              doc.setFont(undefined, 'bold');
              doc.text(pos.value, margin + doc.getStringUnitWidth(currentText.substring(0, pos.start)) * 2.5, currentY);
              
              lastIndex = pos.end;
            }
            
            // Process any remaining text after the last marker
            if (lastIndex < currentText.length) {
              const afterText = currentText.substring(lastIndex);
              if (afterText) {
                doc.setFont(undefined, 'normal');
                doc.text(afterText, margin + doc.getStringUnitWidth(currentText.substring(0, lastIndex)) * 2.5, currentY);
              }
            }
            
            // Reset font for next line
            doc.setFont(undefined, 'normal');
          }
          
          // Move to next paragraph
          y += lines.length * lineHeight + 2;
        } else {
          // Handle each line of the paragraph
          for (let i = 0; i < lines.length; i++) {
            const line = preserveFormatting(lines[i]);
            
            // Check if we need a new page
            if (y + (i * lineHeight) > pageHeight - 10) {
              doc.addPage();
              y = margin - (i * lineHeight);
            }
            
            // Add the line
            doc.text(line, margin, y + (i * lineHeight));
          }
          
          // Move position for next paragraph (with extra spacing)
          y += lines.length * lineHeight + 2;
        }
      }
      
      // Save the PDF
      doc.save('scope-of-work.pdf');
      
      toast({
        title: "PDF Downloaded",
        description: "Document has been downloaded as PDF",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download failed",
        description: "Could not generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsWord = async () => {
    try {
      setIsDownloading(true);
      
      // Process content for variables if needed
      const processedContent = processVariablesForBold(generatedDocument, variables);
      
      // Split content into paragraphs, preserving formatting
      const paragraphs = processedContent.text.split(/\n\s*\n/);
      
      // Create document children array with proper paragraph and line break handling
      const docChildren = [];
      
      // Process each paragraph
      for (const para of paragraphs) {
        if (!para.trim()) {
          // Add an empty paragraph for spacing
          docChildren.push(
            new Paragraph({
              children: [new TextRun("")],
              spacing: { after: 200 }
            })
          );
          continue;
        }
        
        // Split paragraph into lines to preserve single line breaks
        const lines = para.split('\n');
        
        // For paragraphs with just one line, check if it has bold variables
        if (lines.length === 1 && boldVariables && para.includes('__VAR_BOLD_')) {
          // Handle paragraph with variables to bold
          const textRuns = [];
          let currentText = preserveFormatting(para);
          let lastIndex = 0;
          
          // Find all marker positions
          const markerPositions = [];
          for (const variable of variables) {
            const marker = `__VAR_BOLD_${variable.name}__`;
            let startIndex = 0;
            
            while ((startIndex = currentText.indexOf(marker, startIndex)) !== -1) {
              markerPositions.push({
                start: startIndex,
                end: startIndex + marker.length,
                marker,
                variableName: variable.name,
                value: variable.value || variable.name
              });
              startIndex += marker.length;
            }
          }
          
          // Sort marker positions by their start index
          markerPositions.sort((a, b) => a.start - b.start);
          
          // Process text sections between markers
          if (markerPositions.length === 0) {
            // No markers found, add the whole paragraph
            textRuns.push(
              new TextRun({
                text: currentText,
                size: 24
              })
            );
          } else {
            // Add text runs with appropriate formatting
            for (let i = 0; i < markerPositions.length; i++) {
              const pos = markerPositions[i];
              
              // Add text before marker
              if (pos.start > lastIndex) {
                textRuns.push(
                  new TextRun({
                    text: currentText.substring(lastIndex, pos.start),
                    size: 24
                  })
                );
              }
              
              // Add the variable value as bold
              textRuns.push(
                new TextRun({
                  text: pos.value,
                  size: 24,
                  bold: true
                })
              );
              
              lastIndex = pos.end;
            }
            
            // Add any remaining text after the last marker
            if (lastIndex < currentText.length) {
              textRuns.push(
                new TextRun({
                  text: currentText.substring(lastIndex),
                  size: 24
                })
              );
            }
          }
          
          // Add paragraph with mixed formatting
          docChildren.push(
            new Paragraph({
              children: textRuns,
              spacing: { after: 200 }
            })
          );
        }
        // For paragraphs with multiple lines or no bold variables
        else {
          // Create text runs for each line
          const lineRuns = [];
          
          lines.forEach((line, index) => {
            // Handle line with bold variables
            if (boldVariables && line.includes('__VAR_BOLD_')) {
              let currentText = preserveFormatting(line);
              let lastIndex = 0;
              
              // Find all marker positions in this line
              const markerPositions = [];
              for (const variable of variables) {
                const marker = `__VAR_BOLD_${variable.name}__`;
                let startIndex = 0;
                
                while ((startIndex = currentText.indexOf(marker, startIndex)) !== -1) {
                  markerPositions.push({
                    start: startIndex,
                    end: startIndex + marker.length,
                    marker,
                    variableName: variable.name,
                    value: variable.value || variable.name
                  });
                  startIndex += marker.length;
                }
              }
              
              // Sort marker positions by their start index
              markerPositions.sort((a, b) => a.start - b.start);
              
              // If no markers found in this line, add the line as is
              if (markerPositions.length === 0) {
                lineRuns.push(new TextRun({ text: currentText, size: 24 }));
              } else {
                // Process each section in the line
                for (let i = 0; i < markerPositions.length; i++) {
                  const pos = markerPositions[i];
                  
                  // Add text before marker
                  if (pos.start > lastIndex) {
                    lineRuns.push(
                      new TextRun({
                        text: currentText.substring(lastIndex, pos.start),
                        size: 24
                      })
                    );
                  }
                  
                  // Add the variable value as bold
                  lineRuns.push(
                    new TextRun({
                      text: pos.value,
                      size: 24,
                      bold: true
                    })
                  );
                  
                  lastIndex = pos.end;
                }
                
                // Add any remaining text
                if (lastIndex < currentText.length) {
                  lineRuns.push(
                    new TextRun({
                      text: currentText.substring(lastIndex),
                      size: 24
                    })
                  );
                }
              }
            } else {
              // Regular line without bold variables
              lineRuns.push(new TextRun({ text: preserveFormatting(line), size: 24 }));
            }
            
            // Add line break if not the last line
            if (index < lines.length - 1) {
              lineRuns.push(new TextRun({ text: "", break: 1 }));
            }
          });
          
          docChildren.push(
            new Paragraph({
              children: lineRuns,
              spacing: { after: 200 } // Add space after paragraphs
            })
          );
        }
      }
      
      // Create a new Document with the processed paragraphs
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren
          },
        ],
      });
      
      // Generate the .docx file
      const blob = await Packer.toBlob(doc);
      
      // Save the document
      saveAs(blob, 'scope-of-work.docx');
      
      toast({
        title: "Word Document Downloaded",
        description: "Document has been downloaded as a Word document",
      });
    } catch (error) {
      console.error('Word document generation error:', error);
      toast({
        title: "Download failed",
        description: "Could not generate Word document",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex justify-end items-center space-x-2">
      <Button variant="outline" onClick={handleCopyToClipboard}>
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem 
            checked={boldVariables}
            onCheckedChange={handleToggleBoldVariables}
          >
            Make variables bold
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={downloadAsMarkdown}>
            <FileText className="h-4 w-4 mr-2" />
            Markdown (.md)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsText}>
            <FileText className="h-4 w-4 mr-2" />
            Plain Text (.txt)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsPDF}>
            <File className="h-4 w-4 mr-2" />
            PDF Document (.pdf)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsWord}>
            <File className="h-4 w-4 mr-2" />
            Word Document (.docx)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PreviewActions;
