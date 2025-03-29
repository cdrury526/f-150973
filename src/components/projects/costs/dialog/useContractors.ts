
import { useState, useEffect } from 'react';
import { Contractor } from '@/components/projects/contractors/types';
import { fetchContractors } from '@/components/projects/contractors/api/contractorsApi';

export const useContractors = (isDialogOpen: boolean) => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getContractors = async () => {
      setIsLoading(true);
      try {
        const contractorsData = await fetchContractors();
        setContractors(contractorsData);
      } catch (error) {
        console.error('Error fetching contractors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isDialogOpen) {
      getContractors();
    }
  }, [isDialogOpen]);

  return { contractors, isLoading };
};
