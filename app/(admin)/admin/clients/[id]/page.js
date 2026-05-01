export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

export default async function AdminClientDetailPage({ params }) {
  const { id } = await params;
  redirect(`/admin/clubs/${id}/edit`);
}
