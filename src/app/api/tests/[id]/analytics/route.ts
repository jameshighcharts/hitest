import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdminApi(req);
  if (auth) return auth;

  const { id } = params;

  const test = await prisma.test.findUnique({
    where: { id },
    include: {
      _count: { select: { tasks: true, questions: true } },
    },
  });
  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [sessions, tasks, seqAnswers] = await Promise.all([
    prisma.testSession.findMany({
      where: { testId: id },
      include: {
        taskResults: { select: { taskId: true, completed: true } },
        answers: {
          include: { question: { select: { type: true, label: true } } },
        },
      },
      orderBy: { startTime: "desc" },
    }),
    prisma.task.findMany({
      where: { testId: id },
      orderBy: { order: "asc" },
      include: {
        results: {
          select: {
            durationSeconds: true,
            blurCount: true,
            completed: true,
          },
        },
      },
    }),
    prisma.answer.findMany({
      where: { session: { testId: id } },
      include: { question: { select: { type: true, label: true } } },
    }),
  ]);

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.endTime !== null).length;
  const completionRate =
    totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const durations = sessions
    .filter((s) => s.totalDuration !== null)
    .map((s) => s.totalDuration as number);
  const avgTotalDuration =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null;

  const seqQIds = new Set(
    seqAnswers
      .filter((a) => {
        if (a.question.type !== "scale1to5") return false;
        const lower = a.question.label.toLowerCase();
        return lower.includes("easy") || lower.includes("difficult") || lower.includes("seq");
      })
      .map((a) => a.questionId)
  );

  const allSeqValues = seqAnswers
    .filter((a) => seqQIds.has(a.questionId))
    .map((a) => {
      const v = a.value;
      if (typeof v === "number") return v;
      if (typeof v === "object" && v !== null && "value" in (v as object)) return Number((v as { value: unknown }).value);
      return null;
    })
    .filter((v): v is number => v !== null);

  const avgSeqScore =
    allSeqValues.length > 0
      ? Math.round((allSeqValues.reduce((s, v) => s + v, 0) / allSeqValues.length) * 10) / 10
      : null;

  const pendingReviews = sessions.filter(
    (s) => s.flagged && s.validity === "pending"
  ).length;

  const taskBreakdown = tasks.map((task) => {
    const results = task.results;
    const completed = results.filter((r) => r.completed);
    const completionRate =
      results.length > 0 ? Math.round((completed.length / results.length) * 100) : null;
    const avgDurationSeconds =
      completed.length > 0
        ? Math.round(completed.reduce((s, r) => s + r.durationSeconds, 0) / completed.length)
        : null;
    const blurResults = results.filter((r) => r.blurCount !== null);
    const avgBlurCount =
      blurResults.length > 0
        ? Math.round(blurResults.reduce((s, r) => s + (r.blurCount ?? 0), 0) / blurResults.length * 10) / 10
        : null;
    return {
      taskId: task.id,
      order: task.order,
      instructionText: task.instructionText,
      completionRate,
      avgDurationSeconds,
      avgBlurCount,
    };
  });

  const participants = sessions.map((s) => {
    // Per-session SEQ score
    const sessionSeqValues = s.answers
      .filter((a) => seqQIds.has(a.questionId))
      .map((a) => {
        const v = a.value;
        if (typeof v === "number") return v;
        if (typeof v === "object" && v !== null && "value" in (v as object)) return Number((v as { value: unknown }).value);
        return null;
      })
      .filter((v): v is number => v !== null);

    const seqScore =
      sessionSeqValues.length > 0
        ? Math.round((sessionSeqValues.reduce((a, b) => a + b, 0) / sessionSeqValues.length) * 10) / 10
        : null;

    return {
      sessionId: s.id,
      prolificPid: s.prolificPid,
      source: s.source,
      startTime: s.startTime,
      endTime: s.endTime,
      totalDuration: s.totalDuration,
      flagged: s.flagged,
      validity: s.validity,
      seqScore,
      completedTaskCount: s.taskResults.filter((r) => r.completed).length,
      totalTaskCount: tasks.length,
    };
  });

  return NextResponse.json({
    test: {
      id: test.id,
      title: test.title,
      status: test.status,
      createdAt: test.createdAt,
      taskCount: test._count.tasks,
      questionCount: test._count.questions,
    },
    summary: {
      totalSessions,
      completedSessions,
      completionRate,
      avgTotalDuration,
      avgSeqScore,
      pendingReviews,
    },
    taskBreakdown,
    participants,
  });
}
