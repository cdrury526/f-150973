
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Contractor } from './types';

// Mock data for demonstration
const mockContractors: Contractor[] = [
  { 
    id: '1', 
    companyName: 'ABC Construction', 
    companyPhone: '(555) 123-4567',
    companyEmail: 'info@abcconstruction.com',
    contactName: 'John Smith',
    status: 'Active',
    contractorType: 'General Contractor'
  },
  { 
    id: '2', 
    companyName: 'XYZ Builders', 
    companyPhone: '(555) 987-6543',
    companyEmail: 'contact@xyzbuilders.com',
    contactName: 'Jane Doe',
    status: 'Active',
    contractorType: 'Electrical'
  },
  { 
    id: '3', 
    companyName: 'Smith & Sons Contracting', 
    companyPhone: '(555) 456-7890',
    companyEmail: 'info@smithandsons.com',
    contactName: 'Robert Smith',
    status: 'On Hold',
    contractorType: 'Plumbing'
  },
];

interface ContractorsTableProps {
  projectId?: string;
}

const ContractorsTable: React.FC<ContractorsTableProps> = ({ projectId }) => {
  // In a real implementation, we would fetch contractors for the given project ID
  const contractors = mockContractors;

  const renderStatusBadge = (status: Contractor['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'Active':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case 'Inactive':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
      case 'On Hold':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status}</span>;
      default:
        return <span className={baseClasses}>{status}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contractors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Company Name</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Company Phone</TableHead>
                <TableHead>Company Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contractor Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.length > 0 ? (
                contractors.map((contractor) => (
                  <TableRow key={contractor.id}>
                    <TableCell className="font-medium">{contractor.companyName}</TableCell>
                    <TableCell>{contractor.contactName}</TableCell>
                    <TableCell>{contractor.companyPhone}</TableCell>
                    <TableCell>{contractor.companyEmail}</TableCell>
                    <TableCell>{renderStatusBadge(contractor.status)}</TableCell>
                    <TableCell>{contractor.contractorType}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No contractors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractorsTable;
