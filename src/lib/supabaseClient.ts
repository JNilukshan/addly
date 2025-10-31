import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our Ad entity
export interface Ad {
  id: string;
  title: string;
  description: string;
  destination_url: string;
  status: 'active' | 'inactive';
  user_id: string;
  created_at: string;
}
