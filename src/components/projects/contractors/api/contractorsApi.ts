
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
    contractorType: contractor.contractortype,
    archived: contractor.archived || false
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
      contractortype: contractor.contractorType,
      archived: false
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
    contractorType: data.contractortype,
    archived: data.archived || false
  } as Contractor;
};

export const updateContractor = async (id: string, updates: Partial<Contractor>) => {
  // Map the client-side property names to database column names
  const dbUpdates: Record<string, any> = {};
  
  if (updates.companyName !== undefined) dbUpdates.companyname = updates.companyName;
  if (updates.companyPhone !== undefined) dbUpdates.companyphone = updates.companyPhone;
  if (updates.companyEmail !== undefined) dbUpdates.companyemail = updates.companyEmail;
  if (updates.contactName !== undefined) dbUpdates.contactname = updates.contactName;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.contractorType !== undefined) dbUpdates.contractortype = updates.contractorType;
  if (updates.archived !== undefined) dbUpdates.archived = updates.archived;
  
  // Add updated_at timestamp
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('contractors')
    .update(dbUpdates)
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
    contractorType: data.contractortype,
    archived: data.archived || false
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
