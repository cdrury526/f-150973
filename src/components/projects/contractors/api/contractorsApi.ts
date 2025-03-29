
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
  
  // Transform to match our Contractor interface
  const contractors = data.map(contractor => ({
    id: contractor.id,
    companyName: contractor.companyName,
    companyPhone: contractor.companyPhone,
    companyEmail: contractor.companyEmail,
    contactName: contractor.contactName,
    status: contractor.status,
    contractorType: contractor.contractorType
  } as Contractor));

  return contractors;
};

export const createContractor = async (contractor: Omit<Contractor, 'id'>) => {
  const { data, error } = await supabase
    .from('contractors')
    .insert({
      companyName: contractor.companyName,
      companyPhone: contractor.companyPhone,
      companyEmail: contractor.companyEmail,
      contactName: contractor.contactName, 
      status: contractor.status,
      contractorType: contractor.contractorType
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    companyName: data.companyName,
    companyPhone: data.companyPhone,
    companyEmail: data.companyEmail,
    contactName: data.contactName,
    status: data.status,
    contractorType: data.contractorType
  } as Contractor;
};

export const updateContractor = async (id: string, updates: Partial<Contractor>) => {
  const { data, error } = await supabase
    .from('contractors')
    .update({
      companyName: updates.companyName,
      companyPhone: updates.companyPhone,
      companyEmail: updates.companyEmail,
      contactName: updates.contactName,
      status: updates.status,
      contractorType: updates.contractorType,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    companyName: data.companyName,
    companyPhone: data.companyPhone,
    companyEmail: data.companyEmail,
    contactName: data.contactName,
    status: data.status,
    contractorType: data.contractorType
  } as Contractor;
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
