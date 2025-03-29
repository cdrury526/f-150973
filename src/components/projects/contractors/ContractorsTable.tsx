
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock data for demonstration
const mockContractors: { id: string; companyName: string; companyPhone: string }[] = [
  { id: '1', companyName: 'ABC Construction', companyPhone: '(555) 123-4567' },
  { id: '2', companyName: 'XYZ Builders', companyPhone: '(555) 987-6543' },
  { id: '3', companyName: 'Smith & Sons Contracting', companyPhone: '(555) 456-7890' },
];

interface ContractorsTableProps {
  projectId?: string;
}

const ContractorsTable: React.FC<ContractorsTableProps> = ({ projectId }) => {
  // In a real implementation, we would fetch contractors for the given project ID
  const contractors = mockContractors;

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
                <TableHead className="w-[250px]">Company Name</TableHead>
                <TableHead>Company Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.length > 0 ? (
                contractors.map((contractor) => (
                  <TableRow key={contractor.id}>
                    <TableCell className="font-medium">{contractor.companyName}</TableCell>
                    <TableCell>{contractor.companyPhone}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
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
