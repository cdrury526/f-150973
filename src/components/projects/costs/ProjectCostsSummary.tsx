
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ProjectCost } from './types';
import { CircleDollarSign, TrendingDown, TrendingUp, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectCostsSummaryProps {
  costs: ProjectCost[];
}

const ProjectCostsSummary: React.FC<ProjectCostsSummaryProps> = ({ costs }) => {
  const [isOpen, setIsOpen] = useState(true);
  
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
        <div className="flex flex-wrap gap-3">
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
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProjectCostsSummary;
