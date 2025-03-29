
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Contractor, ContractorType } from './types';
import { ContractorTypeCell } from './ContractorTypeSelector';
import { useQuery } from '@tanstack/react-query';
import { fetchContractors } from './api/contractorsApi';

interface ContractorsTableProps {
  projectId?: string;
}

const ContractorsTable: React.FC<ContractorsTableProps> = ({ projectId }) => {
  const { data: contractors = [], isLoading, error } = useQuery({
    queryKey: ['contractors'],
    queryFn: fetchContractors,
  });
  
  const [localContractors, setLocalContractors] = useState<Contractor[]>(contractors);
  
  useEffect(() => {
    if (contractors.length) {
      setLocalContractors(contractors);
    }
  }, [contractors]);
  
  const handleContractorTypeChange = (contractorId: string, newType: ContractorType) => {
    setLocalContractors(prevContractors => 
      prevContractors.map(contractor => 
        contractor.id === contractorId 
          ? { ...contractor, contractorType: newType } 
          : contractor
      )
    );
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading contractors...</p>;
  }

  if (error) {
    return <p className="text-destructive">Error loading contractors. Please try again.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Company Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Company Phone</TableHead>
            <TableHead>Company Email</TableHead>
            <TableHead className="w-[220px]">Contractor Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localContractors.length > 0 ? (
            localContractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell className="font-medium">{contractor.companyName}</TableCell>
                <TableCell>{contractor.contactName}</TableCell>
                <TableCell>{contractor.companyPhone}</TableCell>
                <TableCell>{contractor.companyEmail}</TableCell>
                <TableCell>
                  <ContractorTypeCell 
                    value={contractor.contractorType as ContractorType}
                    onChange={(value) => handleContractorTypeChange(contractor.id, value)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No contractors found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContractorsTable;
