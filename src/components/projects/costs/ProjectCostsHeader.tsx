import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet } from 'lucide-react';
import { ProjectCost } from './types';
import { useToast } from "@/hooks/use-toast";
import { fetchContractors } from '../contractors/api/contractorsApi';

interface ProjectCostsHeaderProps {
  onAddCategoryClick: () => void;
  costs: ProjectCost[];
}

const ProjectCostsHeader: React.FC<ProjectCostsHeaderProps> = ({ onAddCategoryClick, costs }) => {
  const { toast } = useToast();

  const exportToCSV = async () => {
    // Fetch contractors to get their company names
    const contractors = await fetchContractors();
    const contractorsMap = contractors.reduce((acc, contractor) => {
      acc[contractor.id] = contractor.companyName;
      return acc;
    }, {} as Record<string, string>);

    // Calculate total for summary row
    const quoteTotal = costs.reduce((sum, cost) => sum + (cost.quote_price || 0), 0) || 0;
    const actualTotal = costs.reduce((sum, cost) => sum + (cost.actual_price || 0), 0) || 0;
    const differenceTotal = actualTotal - quoteTotal;

    // Create CSV content
    const headers = ['Category', 'Quote Price ($)', 'Actual Price ($)', 'Difference ($)', 'Contractor'];
    
    const rows = costs.map(cost => {
      const difference = (cost.actual_price ?? 0) - cost.quote_price;
      const contractorName = cost.contractor_id ? contractorsMap[cost.contractor_id] || 'Unknown' : 'Not assigned';
      
      return [
        cost.category_name,
        cost.quote_price.toFixed(2),
        cost.actual_price !== null ? cost.actual_price.toFixed(2) : '-',
        cost.actual_price !== null ? difference.toFixed(2) : '-',
        contractorName
      ];
    });
    
    // Add totals row
    rows.push([
      'Total',
      quoteTotal.toFixed(2),
      actualTotal.toFixed(2),
      differenceTotal.toFixed(2),
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
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">Project Costs</CardTitle>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={exportToCSV}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" /> Export to CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddCategoryClick}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>
    </CardHeader>
  );
};

export default ProjectCostsHeader;
