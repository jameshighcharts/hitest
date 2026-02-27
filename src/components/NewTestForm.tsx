"use client";

import { useState } from "react";

export default function NewTestForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    setError(null);
    const res = await fetch("/api/tests", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        githubDemoUrl: formData.get("githubDemoUrl"),
        completionCode: formData.get("completionCode"),
        minTotalSeconds: Number(formData.get("minTotalSeconds")) || null,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      setError(data.error || "Unable to create test");
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-accent text-white rounded px-4 py-2 text-sm font-medium shadow"
      >
        + New Test
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded p-4 shadow space-y-3">
      <h3 className="font-semibold">Create Test</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <input name="title" placeholder="Title" required className="border rounded px-3 py-2" />
        <input name="completionCode" placeholder="Completion code" required className="border rounded px-3 py-2" />
        <input name="githubDemoUrl" placeholder="GitHub Pages URL" required className="border rounded px-3 py-2 md:col-span-2" />
        <textarea
          name="description"
          placeholder="Short description"
          className="border rounded px-3 py-2 md:col-span-2"
          rows={2}
        />
        <input
          type="number"
          name="minTotalSeconds"
          placeholder="Min total seconds (optional)"
          className="border rounded px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-accent text-white rounded px-4 py-2 text-sm font-medium"
          disabled={loading}
        >
          Save
        </button>
        <button type="button" className="text-sm text-slate-600" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
