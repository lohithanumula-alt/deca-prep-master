"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: formData.get("full_name") as string,
        },
      },
    });

    if (signUpError) {
      return { error: signUpError.message };
    }

    // Sign in immediately after signup
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { error: signInError.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Signup failed: ${msg}` };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
