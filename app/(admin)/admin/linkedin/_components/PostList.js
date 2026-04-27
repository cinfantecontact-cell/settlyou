"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPE_LABELS = {
  product_update: "Product",
  industry_insight: "Industry",
  intro: "Intro",
};

function PostRow({ post, onDeleteRequest }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/linkedin/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    if (res.ok) { setEditing(false); router.refresh(); }
  }

  async function handleMarkPosted() {
    setSaving(true);
    const res = await fetch(`/api/admin/linkedin/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(post.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = post.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const isPosted = post.status === "published";
  const date = new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <tr className="hover:bg-surface transition-colors align-top">
      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{date}</td>
      <td className="px-4 py-3">
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {TYPE_LABELS[post.post_type] || post.post_type}
        </span>
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-y"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => { setContent(post.content); setEditing(false); }} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground whitespace-pre-line line-clamp-4">{post.content}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${isPosted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {isPosted ? "Posted" : "Draft"}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {!isPosted && !editing && (
            <button onClick={() => setEditing(true)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-brand-600 hover:border-brand-200 transition-colors">
              Edit
            </button>
          )}
          <button onClick={handleCopy} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${copied ? "border-green-200 text-green-600 bg-green-50" : "border-border text-muted hover:text-foreground"}`}>
            {copied ? "Copied!" : "Copy"}
          </button>
          {!isPosted && (
            <button onClick={handleMarkPosted} disabled={saving} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Mark as posted"}
            </button>
          )}
          <button onClick={() => onDeleteRequest(post.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function PostList({ posts }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/linkedin/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) { setDeleteId(null); router.refresh(); }
  }

  if (!posts?.length) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-sm text-muted mb-4">No posts yet. Generate your first one to get started.</p>
      </div>
    );
  }

  return (
    <>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-foreground mb-2">Delete post?</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              This will permanently remove this post. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <table className="w-full text-sm">
        <thead className="bg-surface border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Content</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} onDeleteRequest={setDeleteId} />
          ))}
        </tbody>
      </table>
    </>
  );
}
