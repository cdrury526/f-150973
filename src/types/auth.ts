
import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type UserRole = 'customer' | 'builder' | 'admin';
