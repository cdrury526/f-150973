
import { supabase } from '@/integrations/supabase/client';
import { Contractor } from '@/components/projects/contractors/types';

export const fetchContractors = async () => {
  const { data, error } = await supabase
    .from('contractors')
    .select('*')
    .order('companyName', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Contractor[];
};

export const createContractor = async (contractor: Omit<Contractor, 'id'>) => {
  const { data, error } = await supabase
    .from('contractors')
    .insert(contractor)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Contractor;
};

export const updateContractor = async (id: string, updates: Partial<Contractor>) => {
  const { data, error } = await supabase
    .from('contractors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Contractor;
};

export const deleteContractor = async (id: string) => {
  const { error } = await supabase
    .from('contractors')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
