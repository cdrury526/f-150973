
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { ProjectCost } from './types';

interface ProjectCostsDataTableProps {
  costs: ProjectCost[];
  onEditClick: (cost: ProjectCost) => void;
  onDeleteClick: (cost: ProjectCost) => void;
}

const ProjectCostsDataTable: React.FC<ProjectCostsDataTableProps> = ({ 
  costs, 
  onEditClick, 
  onDeleteClick 
}) => {
  // Calculate totals
  const quoteTotal = costs.reduce((sum, cost) => sum + (cost.quote_price || 0), 0) || 0;
  const actualTotal = costs.reduce((sum, cost) => sum + (cost.actual_price || 0), 0) || 0;
  const differenceTotal = actualTotal - quoteTotal;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Category</TableHead>
            <TableHead className="text-right">Quote Price ($)</TableHead>
            <TableHead className="text-right">Actual Price ($)</TableHead>
            <TableHead className="text-right">Difference ($)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costs.map((cost) => {
            // Calculate the difference between actual and quote price
            const difference = (cost.actual_price ?? 0) - cost.quote_price;
            
            return (
              <TableRow key={cost.category_id}>
                <TableCell className="font-medium">{cost.category_name}</TableCell>
                <TableCell className="text-right">{cost.quote_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right">
                  {cost.actual_price !== null 
                    ? cost.actual_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                    : '-'}
                </TableCell>
                <TableCell className={`text-right ${difference > 0 ? 'text-red-500' : difference < 0 ? 'text-green-500' : ''}`}>
                  {cost.actual_price !== null 
                    ? difference.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'auto' })
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditClick(cost)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDeleteClick(cost)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {/* Total row */}
          <TableRow className="font-bold">
            <TableCell>Total</TableCell>
            <TableCell className="text-right">{quoteTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
            <TableCell className="text-right">{actualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
            <TableCell className={`text-right ${differenceTotal > 0 ? 'text-red-500' : differenceTotal < 0 ? 'text-green-500' : ''}`}>
              {differenceTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'auto' })}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectCostsDataTable;
