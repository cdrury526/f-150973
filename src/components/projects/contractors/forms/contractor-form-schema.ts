
import * as z from 'zod';
import { ContractorType } from '../types';

// Define the form schema
export const contractorFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyPhone: z.string().min(1, 'Company phone is required'),
  companyEmail: z.string().email('Must be a valid email address'),
  contactName: z.string().min(1, 'Contact name is required'),
  status: z.enum(['Active', 'Inactive', 'On Hold']),
  contractorType: z.string().min(1, 'Contractor type is required'),
});

export type ContractorFormValues = z.infer<typeof contractorFormSchema>;
