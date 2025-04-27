// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/public'

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Log error or warning, avoid throwing here to allow server-side potential usage
    console.error("CRITICAL: Supabase URL or Anon Key missing from PUBLIC env vars. Client-side operations will fail.");
}

// Public client using anon key - suitable for client-side and server-side reads respecting RLS
export const supabase = createClient(supabaseUrl || 'MISSING_URL', supabaseAnonKey || 'MISSING_KEY');

console.log("Supabase public client initialized.");

// Example of creating a server-side admin client (use only in server/.ts files)
// import { env as privateEnv } from '$env/dynamic/private';
// export const createSupabaseAdminClient = () => {
//     const adminUrl = privateEnv.SUPABASE_URL || supabaseUrl; // Use private if set, fallback to public
//     const serviceKey = privateEnv.SUPABASE_SERVICE_ROLE_KEY;
//     if (!adminUrl || !serviceKey) {
//         console.warn("Admin Supabase client cannot be created: URL or Service Key missing.");
//         return null; // Handle this potential null case where used
//     }
//     return createClient(adminUrl, serviceKey, {
//         auth: {
//             // Required for service_role key
//             persistSession: false,
//             autoRefreshToken: false
//         }
//     });
// }