"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SUBJECTS, CLASSES } from "@/lib/constants";
import Link from "next/link";

interface ResourceRecord {
  _id: string;
  title: string;
  slug: string;
  metaDescription: string;
  subject: string;
  targetClass: string;
  chapter: string | null;
  keywords: string[];
  published: boolean;
  viewCount: number;
  createdAt: string;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    metaDescription: "",
    subject: "Mathematics",
    targetClass: "10",
    chapter: "",
    keywords: "",
    content: "",
    published: true,
  });

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterSubject) params.set("subject", filterSubject);
      const res = await fetch(`/api/admin/resources?${params}`);
      const data = await res.json();
      if (data.success) setResources(data.resources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, filterSubject]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      slug: "",
      metaDescription: "",
      subject: "Mathematics",
      targetClass: "10",
      chapter: "",
      keywords: "",
      content: "",
      published: true,
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: !editingId ? autoSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const payload = {
      ...form,
      keywords: form.keywords
        ? form.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [],
    };

    try {
      const url = editingId
        ? `/api/admin/resources/${editingId}`
        : "/api/admin/resources";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(editingId ? "Resource updated!" : "Resource created and live for SEO!");
        setShowModal(false);
        fetchResources();
      } else {
        setError(data.error || "Failed to save resource");
      }
    } catch {
      setError("Network connection error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (resItem: ResourceRecord) => {
    try {
      await fetch(`/api/admin/resources/${resItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !resItem.published }),
      });
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-cream">
            SEO Knowledge Hub & Resources
          </h1>
          <p className="text-sm text-muted-custom mt-1">
            Publish login-free topics, formulas & question banks (Byju's/Shaalaa style) to rank on Google
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-all"
        >
          + Create SEO Article
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search articles by title, keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60"
        />
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Resources Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : resources.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-custom">
            No SEO resources published yet. Click &quot;+ Create SEO Article&quot; to publish your first topic.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Title</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Class / Subject</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Chapter</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Views</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Status</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {resources.map((r) => (
                  <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-cream font-medium">{r.title}</p>
                      <Link
                        href={`/resources/${r.slug}`}
                        target="_blank"
                        className="text-[11px] text-orange-400 hover:underline"
                      >
                        /resources/{r.slug} ↗
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold mr-1.5">
                        Class {r.targetClass}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold">
                        {r.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-custom text-xs">{r.chapter || "—"}</td>
                    <td className="px-4 py-3 text-muted-custom text-xs">{r.viewCount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          r.published
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {r.published ? "Live / Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(r)}
                          className="text-xs text-muted-custom hover:text-cream px-2 py-1 rounded bg-white/5"
                        >
                          {r.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-xs text-red-400 hover:bg-red-500/10 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0d0f12] border border-white/10 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-cream">
                Create SEO Resource Article
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-custom hover:text-cream text-xl">✕</button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">
                  Article Title (Target keyword in title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE Class 10 Light Reflection and Refraction Notes & Important Questions"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60"
                />
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">
                  URL Slug (Clean URL for Google)
                </label>
                <div className="flex items-center rounded-xl bg-white/[0.03] border border-white/10 px-3">
                  <span className="text-xs text-muted-custom/60">/resources/</span>
                  <input
                    type="text"
                    required
                    placeholder="class-10-light-reflection-notes"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="flex-1 py-2.5 px-1 bg-transparent text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">
                  Meta Description (150-160 chars for Google Search Snippet)
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Complete study notes, formulas, and top 10 solved questions for CBSE Class 10 Light chapter prepared by SixBytes Dehradun faculty."
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60 resize-none"
                />
              </div>

              {/* Class & Subject */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Class</label>
                  <select
                    value={form.targetClass}
                    onChange={(e) => setForm({ ...form, targetClass: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Chapter (Optional)</label>
                  <input
                    type="text"
                    placeholder="Chapter 10"
                    value={form.chapter}
                    onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">
                  Keywords (comma-separated for SEO tags)
                </label>
                <input
                  type="text"
                  placeholder="cbse class 10, light notes, physics formula sheet, dehradun coaching"
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60"
                />
              </div>

              {/* HTML/Markdown Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">
                  Article Content (Supports HTML / headings / lists / code)
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder={`<h2>Key Formulas</h2>\n<p>1. Mirror formula: 1/f = 1/v + 1/u</p>\n<h2>Important Questions</h2>\n<p>Q1: State the laws of reflection...</p>`}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full font-mono text-xs px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 focus:outline-none focus:border-orange-500/60"
                />
              </div>

              {/* Published Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-white/20 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-xs text-cream/90 font-medium">Publish immediately (make publicly discoverable)</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg disabled:opacity-50 transition-all"
              >
                {submitting ? "Publishing..." : "Publish Article"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
