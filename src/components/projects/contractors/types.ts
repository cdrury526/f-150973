
export interface Contractor {
  id: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  contactName: string;
  status: 'Active' | 'Inactive' | 'On Hold';
  contractorType: string;
}
