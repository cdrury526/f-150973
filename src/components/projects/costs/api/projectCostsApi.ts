
import { supabase } from '@/integrations/supabase/client';
import { ProjectCost, CostCategory } from '@/components/projects/costs/types';

export const fetchProjectCosts = async (projectId: string) => {
  // Fetch cost categories first
  const { data: categories, error: categoriesError } = await supabase
    .from('cost_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  // Fetch existing costs for this project
  const { data: costs, error: costsError } = await supabase
    .from('project_costs')
    .select(`
      id, 
      category_id, 
      quote_price, 
      actual_price, 
      notes,
      cost_categories (name)
    `)
    .eq('project_id', projectId);

  if (costsError) {
    throw new Error(costsError.message);
  }

  // Transform the costs data
  const transformedCosts = costs?.map(cost => ({
    id: cost.id,
    category_id: cost.category_id,
    category_name: cost.cost_categories?.name || '',
    quote_price: cost.quote_price,
    actual_price: cost.actual_price,
    notes: cost.notes
  })) || [];

  // For categories that don't have costs yet, create empty entries
  const allCosts = categories.map(category => {
    const existingCost = transformedCosts.find(cost => cost.category_id === category.id);
    if (existingCost) {
      return existingCost;
    }
    return {
      id: '',
      category_id: category.id,
      category_name: category.name,
      quote_price: 0,
      actual_price: null,
      notes: null
    };
  });

  return {
    costs: allCosts,
    categories: categories as CostCategory[]
  };
};
