import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://poazlferopkwoyarwikk.supabase.co";
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYXpsZmVyb3Brd295YXJ3aWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDAxMjYsImV4cCI6MjA4OTUxNjEyNn0.V2X4RzCUx6SUTDoiGEOl3B553pzcwc8cV0YIMKh3SlA";

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component — cookies set in middleware
          }
        },
      },
    }
  );
}
