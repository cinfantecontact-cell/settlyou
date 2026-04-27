export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import PostList from "./_components/PostList";
import GenerateButton from "./_components/GenerateButton";
import ConnectLinkedIn from "./_components/ConnectLinkedIn";
import ConnectFeedback from "./_components/ConnectFeedback";

export const metadata = { title: "LinkedIn — Settl Admin" };

export default async function AdminLinkedInPage({ searchParams }) {
  const { connected: connectedParam, error } = await searchParams;
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const [{ data: posts }, { data: tokens }] = await Promise.all([
    admin
      .from("linkedin_posts")
      .select("*")
      .order("created_at", { ascending: false }),
    admin
      .from("linkedin_tokens")
      .select("id")
      .limit(1),
  ]);

  const connected = tokens?.length > 0;
  const stats = {
    total: posts?.length ?? 0,
    drafts: posts?.filter((p) => p.status === "draft").length ?? 0,
    scheduled: posts?.filter((p) => p.status === "scheduled").length ?? 0,
    published: posts?.filter((p) => p.status === "published").length ?? 0,
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LinkedIn</h1>
          <p className="text-sm text-muted mt-1">
            {stats.total} posts · {stats.drafts} drafts · {stats.scheduled}{" "}
            scheduled · {stats.published} published
          </p>
        </div>
        <GenerateButton />
      </div>

      <ConnectFeedback connected={connectedParam === "1"} error={error} />

      <div className="mb-6">
        <ConnectLinkedIn connected={connected} />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
