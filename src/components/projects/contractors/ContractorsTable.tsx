
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Contractor, ContractorType } from './types';
import { ContractorTypeCell } from './ContractorTypeSelector';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContractors, updateContractor } from './api/contractorsApi';
import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ContractorsTableProps {
  projectId?: string;
  showArchived?: boolean;
}

const ContractorsTable: React.FC<ContractorsTableProps> = ({ projectId, showArchived = false }) => {
  const queryClient = useQueryClient();
  
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
  
  const archiveMutation = useMutation({
    mutationFn: ({ id, archived }: { id: string, archived: boolean }) => {
      return updateContractor(id, { archived });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      toast.success(showArchived ? 'Contractor restored' : 'Contractor archived');
    },
    onError: (error) => {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  const handleContractorTypeChange = (contractorId: string, newType: ContractorType) => {
    setLocalContractors(prevContractors => 
      prevContractors.map(contractor => 
        contractor.id === contractorId 
          ? { ...contractor, contractorType: newType } 
          : contractor
      )
    );
  };

  const handleArchive = (id: string, archived: boolean) => {
    archiveMutation.mutate({ id, archived });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading contractors...</p>;
  }

  if (error) {
    return <p className="text-destructive">Error loading contractors. Please try again.</p>;
  }

  // Filter contractors based on archived status
  const filteredContractors = localContractors.filter(
    contractor => (showArchived ? contractor.archived : !contractor.archived)
  );

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
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContractors.length > 0 ? (
            filteredContractors.map((contractor) => (
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
                <TableCell>
                  {showArchived ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleArchive(contractor.id, false)}
                      disabled={archiveMutation.isPending}
                    >
                      <ArchiveRestore className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={archiveMutation.isPending}
                        >
                          <Archive className="h-4 w-4 mr-1" />
                          Archive
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Archive Contractor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to archive {contractor.companyName}? 
                            Archived contractors can be viewed and restored from the archived contractors view.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleArchive(contractor.id, true)}>
                            Archive
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {showArchived 
                  ? "No archived contractors found." 
                  : "No contractors found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContractorsTable;
