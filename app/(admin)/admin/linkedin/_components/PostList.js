"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPE_META = {
  product_update:       { label: "Product",     color: "bg-brand-50 text-brand-700 border-brand-100" },
  industry_insight:     { label: "Industry",    color: "bg-purple-50 text-purple-700 border-purple-100" },
  institution_spotlight:{ label: "Spotlight",   color: "bg-blue-50 text-blue-700 border-blue-100" },
};

function PostRow({ post, selected, onToggle, onDeleteRequest }) {
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
    await fetch(`/api/admin/linkedin/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    setSaving(false);
    router.refresh();
  }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(post.content); }
    catch {
      const el = document.createElement("textarea");
      el.value = post.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isPosted = post.status === "published";
  const typeMeta = TYPE_META[post.post_type] ?? { label: post.post_type, color: "bg-gray-50 text-gray-600 border-gray-100" };
  const date = new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <tr className={`hover:bg-surface/60 transition-colors align-top ${selected ? "bg-brand-50/40" : ""}`}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(post.id)}
          className="w-4 h-4 rounded border-border text-brand-600 focus:ring-brand-200 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{date}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${typeMeta.color}`}>
          {typeMeta.label}
        </span>
      </td>
      <td className="px-4 py-3 max-w-lg">
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-200 resize-y"
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
          <p className="text-sm text-foreground whitespace-pre-line line-clamp-4 leading-relaxed">{post.content}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${isPosted ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}>
          {isPosted ? "Posted" : "Draft"}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          {!isPosted && !editing && (
            <button onClick={() => setEditing(true)} className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-brand-600 hover:border-brand-200 transition-colors">
              Edit
            </button>
          )}
          <button onClick={handleCopy} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${copied ? "border-green-200 text-green-600 bg-green-50" : "border-border text-muted hover:text-foreground"}`}>
            {copied ? "Copied!" : "Copy"}
          </button>
          {!isPosted && (
            <button onClick={handleMarkPosted} disabled={saving} className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-60">
              Mark posted
            </button>
          )}
          <button onClick={() => onDeleteRequest(post.id)} className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function PostList({ posts }) {
  const router = useRouter();
  const [selected, setSelected] = useState(new Set());
  const [deleteId, setDeleteId] = useState(null);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const allSelected = posts?.length > 0 && selected.size === posts.length;

  function toggleOne(id) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(posts.map((p) => p.id)));
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/linkedin/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    router.refresh();
  }

  async function handleBulkDelete() {
    setDeletingBulk(true);
    await fetch("/api/admin/linkedin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected] }),
    });
    setDeletingBulk(false);
    setSelected(new Set());
    router.refresh();
  }

  if (!posts?.length) {
    return (
      <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
          <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground">No posts yet</p>
        <p className="text-xs text-muted">Click "+ Generate post" to create your first LinkedIn draft.</p>
      </div>
    );
  }

  return (
    <>
      {/* Single delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-foreground mb-2">Delete post?</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">This will permanently remove this post.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-surface transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-brand-50 border-b border-brand-100">
          <span className="text-xs font-semibold text-brand-700">{selected.size} selected</span>
          <button
            onClick={handleBulkDelete}
            disabled={deletingBulk}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deletingBulk ? "Deleting..." : `Delete ${selected.size}`}
          </button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="bg-surface border-b border-border">
          <tr>
            <th className="px-4 py-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-border text-brand-600 focus:ring-brand-200 cursor-pointer"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Content</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              selected={selected.has(post.id)}
              onToggle={toggleOne}
              onDeleteRequest={setDeleteId}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
