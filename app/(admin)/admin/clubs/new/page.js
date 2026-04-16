import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewClubForm from "./_components/NewClubForm";

export const metadata = { title: "New University — Settl Admin" };

export default async function NewClubPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <a href="/admin/clubs" className="text-sm text-muted hover:text-foreground transition-colors">← Clients</a>
        <h1 className="text-2xl font-bold text-foreground mt-4">New university</h1>
        <p className="text-sm text-muted mt-1">Creates a unique join link and PIN for this university.</p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error === "slug_taken" ? "That slug is already in use — try another." : "Something went wrong. Please try again."}
        </div>
      )}

      <NewClubForm />
    </div>
  );
}
