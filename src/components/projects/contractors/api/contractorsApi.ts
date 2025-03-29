
import { supabase } from '@/integrations/supabase/client';
import { Contractor } from '@/components/projects/contractors/types';

export const fetchContractors = async () => {
  const { data, error } = await supabase
    .from('contractors')
    .select('*')
    .order('companyname', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  
  // Transform to match our Contractor interface
  const contractors = data.map(contractor => ({
    id: contractor.id,
    companyName: contractor.companyname,
    companyPhone: contractor.companyphone,
    companyEmail: contractor.companyemail,
    contactName: contractor.contactname,
    status: contractor.status,
    contractorType: contractor.contractortype
  } as Contractor));

  return contractors;
};

export const createContractor = async (contractor: Omit<Contractor, 'id'>) => {
  const { data, error } = await supabase
    .from('contractors')
    .insert({
      companyname: contractor.companyName,
      companyphone: contractor.companyPhone,
      companyemail: contractor.companyEmail,
      contactname: contractor.contactName, 
      status: contractor.status,
      contractortype: contractor.contractorType
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    companyName: data.companyname,
    companyPhone: data.companyphone,
    companyEmail: data.companyemail,
    contactName: data.contactname,
    status: data.status,
    contractorType: data.contractortype
  } as Contractor;
};

export const updateContractor = async (id: string, updates: Partial<Contractor>) => {
  const { data, error } = await supabase
    .from('contractors')
    .update({
      companyname: updates.companyName,
      companyphone: updates.companyPhone,
      companyemail: updates.companyEmail,
      contactname: updates.contactName,
      status: updates.status,
      contractortype: updates.contractorType,
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
    companyName: data.companyname,
    companyPhone: data.companyphone,
    companyEmail: data.companyemail,
    contactName: data.contactname,
    status: data.status,
    contractorType: data.contractortype
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
