
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Contractor, ContractorType } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContractors, updateContractor } from './api/contractorsApi';
import { Button } from '@/components/ui/button';
import { Pencil, ArchiveRestore } from 'lucide-react';
import { toast } from 'sonner';
import { ContractorEditDialog } from './ContractorEditDialog';

interface ContractorsTableProps {
  projectId?: string;
  showArchived?: boolean;
}

const ContractorsTable: React.FC<ContractorsTableProps> = ({ projectId, showArchived = false }) => {
  const queryClient = useQueryClient();
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
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
  
  const restoreMutation = useMutation({
    mutationFn: (id: string) => {
      return updateContractor(id, { archived: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      toast.success('Contractor restored');
    },
    onError: (error) => {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  const handleRestore = (id: string) => {
    restoreMutation.mutate(id);
  };
  
  const handleEditClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading contractors...</p>;
  }

  if (error) {
    return <p className="text-destructive">Error loading contractors. Please try again.</p>;
  }

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
            <TableHead className="w-[150px]">Company Phone</TableHead>
            <TableHead>Company Email</TableHead>
            <TableHead className="w-[180px]">Contractor Type</TableHead>
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
                <TableCell>{contractor.contractorType}</TableCell>
                <TableCell>
                  {showArchived ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRestore(contractor.id)}
                      disabled={restoreMutation.isPending}
                    >
                      <ArchiveRestore className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditClick(contractor)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
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
      
      <ContractorEditDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        contractor={selectedContractor} 
      />
    </div>
  );
};

export default ContractorsTable;
