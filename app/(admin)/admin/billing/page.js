export const dynamic = 'force-dynamic';
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BillingClient from "./_components/BillingClient";

export const metadata = { title: "Billing — Settl Admin" };

export default async function BillingPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const [{ data: billing }, { data: clubs }] = await Promise.all([
    admin.from("billing").select("*").order("billing_date", { ascending: false }),
    admin.from("clubs").select("id, name").order("name"),
  ]);

  return <BillingClient billing={billing ?? []} clubs={clubs ?? []} />;
}
