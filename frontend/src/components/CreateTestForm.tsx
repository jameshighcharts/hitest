"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export function CreateTestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      completionCode: (form.elements.namedItem("completionCode") as HTMLInputElement).value,
      githubDemoUrl: (form.elements.namedItem("githubPagesUrl") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value || undefined,
      minTotalSeconds: (() => {
        const v = (form.elements.namedItem("minDuration") as HTMLInputElement).value;
        return v ? Number(v) * 60 : undefined;
      })(),
    };

    try {
      const result = await apiFetch<{ test: { id: string } }>("/api/tests", {
        method: "POST",
        body: JSON.stringify(data),
      });
      router.push(`/admin/tests/${result.test.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. React Fundamentals Assessment"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="completionCode">Completion Code</Label>
        <Input
          id="completionCode"
          name="completionCode"
          placeholder="e.g. DONE-2024"
          required
        />
        <p className="text-xs text-muted-foreground">
          Participants enter this code when they finish the test.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="githubPagesUrl">GitHub Pages URL</Label>
        <Input
          id="githubPagesUrl"
          name="githubPagesUrl"
          type="url"
          placeholder="https://yourusername.github.io/test-repo"
          required
        />
        <p className="text-xs text-muted-foreground">
          The URL where participants access this test.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Briefly describe what this test covers…"
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="minDuration">Minimum Duration (minutes)</Label>
        <Input
          id="minDuration"
          name="minDuration"
          type="number"
          min={1}
          placeholder="e.g. 30"
        />
        <p className="text-xs text-muted-foreground">
          Participants who complete faster than this will be flagged for review.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/tests")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create Test"}
        </Button>
      </div>
    </form>
  );
}
