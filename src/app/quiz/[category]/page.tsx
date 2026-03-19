import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuizPageClient from "./QuizPageClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { category } = await params;

  if (category !== "business-admin") {
    redirect("/dashboard");
  }

  return <QuizPageClient />;
}
