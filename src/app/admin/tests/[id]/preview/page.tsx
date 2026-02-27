import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import ParticipantFlow from "@/components/ParticipantFlow";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getTest(id: string) {
  return prisma.test.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { order: "asc" } },
      questions: { orderBy: { order: "asc" } },
    },
  });
}

export default async function PreviewPage({ params }: { params: { id: string } }) {
  requireAdmin();
  const test = await getTest(params.id);
  if (!test) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <p className="text-slate-700">Test not found.</p>
        <Link href="/admin" className="text-accent underline text-sm">Back</Link>
      </main>
    );
  }

  // dummy prolific identifiers for preview only
  const dummy = {
    prolificPid: "PREVIEW_PID",
    studyId: "PREVIEW_STUDY",
    sessionId: "PREVIEW_SESSION",
  };

  const safeTest = JSON.parse(JSON.stringify(test));

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Preview: {test.title}</h1>
        <Link href={`/admin/tests/${test.id}`} className="text-sm text-slate-600 underline">Back to editor</Link>
      </div>
      <ParticipantFlow
        test={safeTest}
        prolificPid={dummy.prolificPid}
        studyId={dummy.studyId}
        sessionId={dummy.sessionId}
        preview
      />
    </main>
  );
}
