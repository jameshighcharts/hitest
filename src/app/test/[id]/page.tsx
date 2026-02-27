import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ParticipantFlow from "@/components/ParticipantFlow";

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

export default async function TestPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[]>;
}) {
  const { id } = params;
  const test = await getTest(id);
  if (!test || test.status !== "published") return notFound();

  const pid = searchParams.PROLIFIC_PID as string | undefined;
  const studyId = searchParams.STUDY_ID as string | undefined;
  const sessionId = searchParams.SESSION_ID as string | undefined;

  if (!pid || !studyId || !sessionId) {
    return redirect("/missing-params");
  }

  const safeTest = JSON.parse(JSON.stringify(test));

  return (
    <main className="min-h-screen bg-slate-50">
      <ParticipantFlow test={safeTest} prolificPid={pid} studyId={studyId} sessionId={sessionId} />
    </main>
  );
}
