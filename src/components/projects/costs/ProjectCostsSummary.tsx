
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ProjectCost } from './types';
import { CircleDollarSign, TrendingDown, TrendingUp, Calculator, ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProjectCostsSummaryProps {
  costs: ProjectCost[];
}

const ProjectCostsSummary: React.FC<ProjectCostsSummaryProps> = ({ costs }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  
  const summary = useMemo(() => {
    // Calculate totals
    const quoteTotal = costs.reduce((sum, cost) => sum + (cost.quote_price || 0), 0) || 0;
    const actualTotal = costs.reduce((sum, cost) => sum + (cost.actual_price || 0), 0) || 0;
    const differenceTotal = actualTotal - quoteTotal;
    const percentComplete = costs.filter(cost => cost.actual_price !== null).length / costs.length * 100;
    
    return {
      quoteTotal,
      actualTotal,
      differenceTotal,
      percentComplete: isNaN(percentComplete) ? 0 : percentComplete,
      categoriesCount: costs.length,
      categoriesWithCostsCount: costs.filter(cost => cost.actual_price !== null).length
    };
  }, [costs]);

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Category', 'Quote Price ($)', 'Actual Price ($)', 'Difference ($)', 'Contractor'];
    
    const rows = costs.map(cost => {
      const difference = (cost.actual_price ?? 0) - cost.quote_price;
      return [
        cost.category_name,
        cost.quote_price.toFixed(2),
        cost.actual_price !== null ? cost.actual_price.toFixed(2) : '-',
        cost.actual_price !== null ? difference.toFixed(2) : '-',
        cost.contractor_id ? 'Assigned' : 'Not assigned'
      ];
    });
    
    // Add totals row
    rows.push([
      'Total',
      summary.quoteTotal.toFixed(2),
      summary.actualTotal.toFixed(2),
      summary.differenceTotal.toFixed(2),
      ''
    ]);
    
    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'project_costs.csv');
    
    // Append the link to the document
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Project costs have been exported to CSV",
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors bg-muted/50 border border-border shadow-sm">
        <div className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="font-medium">Cost Summary</span>
        </div>
        <div className="flex items-center">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 opacity-70" />
          ) : (
            <ChevronDown className="h-4 w-4 opacity-70" />
          )}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <div className="flex flex-wrap gap-3 mb-3">
          <Card className="flex-1 min-w-[180px]">
            <CardContent className="p-3 flex items-center">
              <CircleDollarSign className="h-8 w-8 mr-3 text-primary opacity-70" />
              <div>
                <div className="text-xs text-muted-foreground">Budget</div>
                <div className="font-semibold">${summary.quoteTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-muted-foreground">{summary.categoriesCount} categories</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1 min-w-[180px]">
            <CardContent className="p-3 flex items-center">
              <CircleDollarSign className="h-8 w-8 mr-3 text-blue-500 opacity-70" />
              <div>
                <div className="text-xs text-muted-foreground">Actual</div>
                <div className="font-semibold">${summary.actualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-muted-foreground">{summary.categoriesWithCostsCount}/{summary.categoriesCount} complete</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1 min-w-[180px]">
            <CardContent className="p-3 flex items-center">
              {summary.differenceTotal > 0 ? (
                <TrendingUp className="h-8 w-8 mr-3 text-red-500 opacity-70" />
              ) : (
                <TrendingDown className="h-8 w-8 mr-3 text-green-500 opacity-70" />
              )}
              <div>
                <div className="text-xs text-muted-foreground">Difference</div>
                <div className={`font-semibold ${summary.differenceTotal > 0 ? 'text-red-500' : summary.differenceTotal < 0 ? 'text-green-500' : ''}`}>
                  ${Math.abs(summary.differenceTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {summary.differenceTotal > 0 ? ' over' : summary.differenceTotal < 0 ? ' under' : ''}
                </div>
                <div className="text-xs text-muted-foreground">
                  {summary.differenceTotal > 0 ? 'Over budget' : summary.differenceTotal < 0 ? 'Under budget' : 'On budget'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={exportToExcel}
          >
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Export to CSV
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProjectCostsSummary;
