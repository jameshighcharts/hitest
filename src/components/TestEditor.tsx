"use client";

import { useState } from "react";
import Link from "next/link";

type QuestionType = "text" | "textarea" | "multipleChoice" | "scale1to5";

type Task = {
  id: string;
  instructionText: string;
  minTimeSeconds: number | null;
  order: number;
};

type Question = {
  id: string;
  label: string;
  type: QuestionType;
  options: any;
  required: boolean;
  order: number;
};

type Session = {
  id: string;
  prolificPid: string;
  studyId: string;
  sessionId: string;
  endTime: string | null;
  totalDuration: number | null;
  flagged: boolean;
};

type TestProps = {
  test: {
    id: string;
    title: string;
    description: string | null;
    githubDemoUrl: string;
    completionCode: string;
    minTotalSeconds: number | null;
    status: "draft" | "published";
    tasks: Task[];
    questions: Question[];
    sessions: Session[];
  };
  avgDuration: number;
  flaggedCount: number;
  completionCount: number;
};

async function apiRequest(path: string, options: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Request failed");
  }
  return res.json();
}

export default function TestEditor({ test, avgDuration, flaggedCount, completionCount }: TestProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMetadata = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      githubDemoUrl: form.get("githubDemoUrl"),
      completionCode: form.get("completionCode"),
      minTotalSeconds: Number(form.get("minTotalSeconds")) || null,
      status: form.get("status"),
    };

    try {
      await apiRequest(`/api/tests/${test.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addTask = async () => {
    const instructionText = prompt("Task instruction");
    if (!instructionText) return;
    await apiRequest(`/api/tests/${test.id}/tasks`, {
      method: "POST",
      body: JSON.stringify({ instructionText, order: test.tasks.length + 1 }),
    });
    window.location.reload();
  };

  const updateTask = async (task: Task) => {
    const instructionText = prompt("Edit instruction", task.instructionText) || task.instructionText;
    const minTime = prompt("Minimum seconds (blank for none)", task.minTimeSeconds?.toString() || "");
    await apiRequest(`/api/tests/${test.id}/tasks`, {
      method: "PUT",
      body: JSON.stringify({
        id: task.id,
        instructionText,
        minTimeSeconds: minTime ? Number(minTime) : null,
        order: task.order,
      }),
    });
    window.location.reload();
  };

  const deleteTask = async (task: Task) => {
    if (!confirm("Delete task?")) return;
    await apiRequest(`/api/tests/${test.id}/tasks`, {
      method: "DELETE",
      body: JSON.stringify({ id: task.id }),
    });
    window.location.reload();
  };

  const addQuestion = async () => {
    const label = prompt("Question text");
    if (!label) return;
    const type = (prompt("Type (text|textarea|multipleChoice|scale1to5)", "text") || "text") as QuestionType;
    let options: string[] | null = null;
    if (type === "multipleChoice") {
      const opts = prompt("Options (comma separated)");
      options = opts ? opts.split(",").map((o) => o.trim()) : [];
    }
    await apiRequest(`/api/tests/${test.id}/questions`, {
      method: "POST",
      body: JSON.stringify({ label, type, options, order: test.questions.length + 1 }),
    });
    window.location.reload();
  };

  const updateQuestion = async (q: Question) => {
    const label = prompt("Edit question", q.label) || q.label;
    let options = q.options as any;
    if (q.type === "multipleChoice") {
      const opts = prompt(
        "Options (comma separated)",
        Array.isArray(q.options) ? q.options.join(",") : ""
      );
      options = opts ? opts.split(",").map((o) => o.trim()) : [];
    }
    await apiRequest(`/api/tests/${test.id}/questions`, {
      method: "PUT",
      body: JSON.stringify({
        id: q.id,
        label,
        required: true,
        type: q.type,
        options,
        order: q.order,
      }),
    });
    window.location.reload();
  };

  const deleteQuestion = async (q: Question) => {
    if (!confirm("Delete question?")) return;
    await apiRequest(`/api/tests/${test.id}/questions`, {
      method: "DELETE",
      body: JSON.stringify({ id: q.id }),
    });
    window.location.reload();
  };

  const csvUrl = `/api/tests/${test.id}/export`;

  return (
    <div className="space-y-6">
      <section className="bg-white border rounded p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Metadata</h2>
          <div className="text-sm text-slate-600 space-x-3">
            <span>Completions: {completionCount}</span>
            <span>Avg duration: {avgDuration ? `${avgDuration}s` : "–"}</span>
            <span>Flagged: {flaggedCount}</span>
          </div>
        </div>
        <form onSubmit={handleMetadata} className="grid gap-3 md:grid-cols-2">
          <input name="title" defaultValue={test.title} className="border rounded px-3 py-2" required />
          <select name="status" defaultValue={test.status} className="border rounded px-3 py-2">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <input
            name="githubDemoUrl"
            defaultValue={test.githubDemoUrl}
            className="border rounded px-3 py-2 md:col-span-2"
            required
          />
          <input
            name="completionCode"
            defaultValue={test.completionCode}
            className="border rounded px-3 py-2 md:col-span-2"
            required
          />
          <textarea
            name="description"
            defaultValue={test.description || ""}
            className="border rounded px-3 py-2 md:col-span-2"
            rows={3}
          />
          <input
            type="number"
            name="minTotalSeconds"
            placeholder="Minimum total seconds"
            defaultValue={test.minTotalSeconds ?? undefined}
            className="border rounded px-3 py-2"
          />
          {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-accent text-white rounded px-4 py-2 text-sm font-medium"
              disabled={saving}
            >
              Save
            </button>
            <Link
              href={`/test/${test.id}`}
              className="text-sm underline text-slate-700"
              target="_blank"
            >
              Open participant link
            </Link>
            <Link
              href={`/admin/tests/${test.id}/preview`}
              className="text-sm underline text-slate-700"
              target="_blank"
            >
              Preview
            </Link>
          </div>
        </form>
        <div className="mt-4 text-sm text-slate-600 bg-slate-50 border rounded px-3 py-2">
          <p className="font-medium text-slate-700">Participant link</p>
          <code className="block text-xs whitespace-pre-wrap break-words">
            {`${process.env.NEXT_PUBLIC_APP_URL || ""}/test/${test.id}?PROLIFIC_PID=<PID>&STUDY_ID=<STUDY_ID>&SESSION_ID=<SESSION_ID>`}
          </code>
        </div>
      </section>

      <section className="bg-white border rounded p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Tasks</h3>
          <button onClick={addTask} className="text-sm text-accent">+ Add task</button>
        </div>
        <div className="space-y-2">
          {test.tasks.map((task) => (
            <div key={task.id} className="border rounded px-3 py-2 flex items-start justify-between">
              <div>
                <p className="font-medium">#{task.order} — {task.instructionText}</p>
                {task.minTimeSeconds ? (
                  <p className="text-xs text-slate-500">Min: {task.minTimeSeconds}s</p>
                ) : null}
              </div>
              <div className="flex gap-2 text-sm">
                <button onClick={() => updateTask(task)} className="text-accent">Edit</button>
                <button onClick={() => deleteTask(task)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
          {!test.tasks.length && <p className="text-sm text-slate-600">No tasks yet.</p>}
        </div>
      </section>

      <section className="bg-white border rounded p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Questions</h3>
          <button onClick={addQuestion} className="text-sm text-accent">+ Add question</button>
        </div>
        <div className="space-y-2">
          {test.questions.map((q) => (
            <div key={q.id} className="border rounded px-3 py-2 flex items-start justify-between">
              <div>
                <p className="font-medium">#{q.order} — {q.label}</p>
                <p className="text-xs text-slate-500">Type: {q.type}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button onClick={() => updateQuestion(q)} className="text-accent">Edit</button>
                <button onClick={() => deleteQuestion(q)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
          {!test.questions.length && <p className="text-sm text-slate-600">No questions yet.</p>}
        </div>
      </section>

      <section className="bg-white border rounded p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Submissions</h3>
          <a href={csvUrl} className="text-sm text-accent" target="_blank" rel="noreferrer">
            Export CSV
          </a>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-1 pr-3">Prolific PID</th>
                <th className="py-1 pr-3">Duration (s)</th>
                <th className="py-1 pr-3">Flagged</th>
                <th className="py-1 pr-3">Session ID</th>
              </tr>
            </thead>
            <tbody>
              {test.sessions.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-1 pr-3">{s.prolificPid}</td>
                  <td className="py-1 pr-3">{s.totalDuration ?? "–"}</td>
                  <td className="py-1 pr-3">{s.flagged ? "Yes" : "No"}</td>
                  <td className="py-1 pr-3">{s.sessionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
