
import * as z from 'zod';
import { ContractorType } from '../types';

// US phone validation pattern
const usPhoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

// Define the form schema
export const contractorFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyPhone: z.string()
    .min(1, 'Company phone is required')
    .regex(usPhoneRegex, 'Please enter a valid US phone number (e.g., 555-123-4567)'),
  companyEmail: z.string().email('Must be a valid email address'),
  contactName: z.string().min(1, 'Contact name is required'),
  status: z.enum(['Active', 'Inactive', 'On Hold']),
  contractorType: z.string().min(1, 'Contractor type is required'),
});

export type ContractorFormValues = z.infer<typeof contractorFormSchema>;

// Helper function to format phone input
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format the phone number as (XXX) XXX-XXXX
  if (cleaned.length === 0) {
    return '';
  } else if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
};
