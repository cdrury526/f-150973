
export interface ProjectCost {
  id: string;
  category_id: string;
  category_name: string;
  quote_price: number;
  actual_price: number | null;
  notes: string | null;
  contractor_id?: string;
}

export interface CostCategory {
  id: string;
  name: string;
  display_order: number;
}
