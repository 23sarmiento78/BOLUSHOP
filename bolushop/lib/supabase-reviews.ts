import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_REVIEWS_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_REVIEWS_SUPABASE_ANON_KEY || '';

// Cliente específico para la base de datos de reseñas/comentarios
export const supabaseReviews = createClient(supabaseUrl, supabaseAnonKey);
