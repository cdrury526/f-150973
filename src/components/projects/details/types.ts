
export interface DOWVariable {
  id: string;
  name: string;
  value: string;
  type?: 'string' | 'number' | 'date';
  isValid?: boolean;
  errorMessage?: string;
}
