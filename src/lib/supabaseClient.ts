import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';
import { browser } from '$app/environment'; // To check if running in browser

let supabaseInstance: SupabaseClient | null = null;

function initializeSupabase(): SupabaseClient {
    const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL || privateEnv.SUPABASE_URL; // Use private URL on server if public is missing
    const supabaseAnonKey = publicEnv.PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = privateEnv.SUPABASE_SERVICE_ROLE_KEY;

    let client: SupabaseClient;

    if (!supabaseUrl) {
        throw new Error("Supabase URL is not set in environment variables (PUBLIC_SUPABASE_URL or SUPABASE_URL).");
    }

    if (browser) {
        // --- Client-side Initialization ---
        if (!supabaseAnonKey) {
             throw new Error("PUBLIC_SUPABASE_ANON_KEY is not set for client-side Supabase.");
        }
        console.log("Initializing Supabase client (client-side) with Anon Key.");
        client = createClient(supabaseUrl, supabaseAnonKey);

    } else {
        // --- Server-side Initialization ---
        if (!supabaseServiceKey) {
             // Fallback to Anon key on server if Service key is missing, but log warning
             console.warn("SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to PUBLIC_SUPABASE_ANON_KEY for server-side client. RLS policies will apply.");
             if (!supabaseAnonKey) {
                 throw new Error("Cannot initialize server-side Supabase client: No Service Key and no Anon Key found.");
             }
             client = createClient(supabaseUrl, supabaseAnonKey);
        } else {
             console.log("Initializing Supabase client (server-side) with Service Role Key.");
             client = createClient(supabaseUrl, supabaseServiceKey, {
                 auth: {
                     persistSession: false,
                     autoRefreshToken: false,
                     // detectSessionInUrl: false, // Might be needed depending on library version
                 }
             });
        }
    }
    return client;
}

// Singleton pattern: Initialize only once
// This check ensures it doesn't run during build unnecessarily if imported top-level
// It will run when the module is first *used* either on server or client.
if (!supabaseInstance && (browser || privateEnv.POSTGRES_URL)) { // Check for POSTGRES_URL as proxy for server env
    supabaseInstance = initializeSupabase();
}


// Export the initialized client instance directly
// Add a check in case initialization failed somehow (though it should throw)
export const supabase = supabaseInstance ?? createClient('invalid_url', 'invalid_key'); // Provide dummy fallback to satisfy TS non-null, error should have thrown

// Optional: Explicit function to get the admin client if needed elsewhere server-side
// export function getSupabaseAdminClient(): SupabaseClient | null { ... }