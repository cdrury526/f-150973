
import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCost } from './types';

interface ProjectCostsSummaryProps {
  costs: ProjectCost[];
}

const ProjectCostsSummary: React.FC<ProjectCostsSummaryProps> = ({ costs }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Budget</span>
            <span className="text-2xl font-bold">${summary.quoteTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs text-muted-foreground mt-1">{summary.categoriesCount} categories planned</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Actual Spending</span>
            <span className="text-2xl font-bold">${summary.actualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs text-muted-foreground mt-1">{summary.categoriesWithCostsCount} of {summary.categoriesCount} categories with costs</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Budget Difference</span>
            <span className={`text-2xl font-bold ${summary.differenceTotal > 0 ? 'text-red-500' : summary.differenceTotal < 0 ? 'text-green-500' : ''}`}>
              ${summary.differenceTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'auto' })}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {summary.differenceTotal > 0 ? 'Over budget' : summary.differenceTotal < 0 ? 'Under budget' : 'On budget'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCostsSummary;
