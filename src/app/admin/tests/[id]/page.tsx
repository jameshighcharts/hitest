import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import TestEditor from "@/components/TestEditor";

export const dynamic = "force-dynamic";

async function getData(id: string) {
  const test = await prisma.test.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { order: "asc" } },
      questions: { orderBy: { order: "asc" } },
      sessions: {
        orderBy: { startTime: "desc" },
        include: {
          answers: true,
          taskResults: true,
        },
      },
    },
  });
  return test;
}

export default async function TestDetail({ params }: { params: { id: string } }) {
  requireAdmin();
  const test = await getData(params.id);
  if (!test) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-slate-700">Test not found.</p>
        <Link href="/admin" className="text-accent underline">Back</Link>
      </main>
    );
  }

  const finishedSessions = test.sessions.filter((s) => s.endTime);
  const avgDuration =
    finishedSessions.length > 0
      ? Math.round(
          finishedSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) /
            finishedSessions.length,
        )
      : 0;
  const flaggedCount = finishedSessions.filter((s) => s.flagged).length;
  const completionCount = finishedSessions.length;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Link href="/admin" className="text-sm text-slate-500">← Back</Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{test.title}</h1>
        <span className={`text-xs px-2 py-1 rounded ${
          test.status === "published"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {test.status}
        </span>
      </div>
      <TestEditor
        test={test}
        avgDuration={avgDuration}
        flaggedCount={flaggedCount}
        completionCount={completionCount}
      />
    </main>
  );
}
