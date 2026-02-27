import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth) return auth;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalTests,
    activeTests,
    allSessions,
    completedSessions,
    pendingReviews,
    flaggedSessions,
    sourceBreakdown,
    trend,
    testsWithTasks,
    seqAnswers,
    taskDurations,
  ] = await Promise.all([
    prisma.test.count(),
    prisma.test.count({ where: { status: "published" } }),
    prisma.testSession.count(),
    prisma.testSession.count({ where: { endTime: { not: null } } }),
    prisma.testSession.count({ where: { validity: "pending", flagged: true } }),
    prisma.testSession.findMany({
      where: { flagged: true },
      orderBy: { startTime: "desc" },
      take: 10,
      include: { test: { select: { title: true } } },
    }),
    prisma.testSession.groupBy({
      by: ["source"],
      _count: { _all: true },
    }),
    prisma.$queryRaw<{ date: string; completions: bigint }[]>`
      SELECT DATE("endTime")::text AS date, COUNT(*)::bigint AS completions
      FROM "TestSession"
      WHERE "endTime" IS NOT NULL AND "endTime" >= ${thirtyDaysAgo}
      GROUP BY DATE("endTime")
      ORDER BY DATE("endTime") ASC
    `,
    prisma.test.findMany({
      where: { status: "published" },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        tasks: {
          orderBy: { order: "asc" },
          include: {
            results: { select: { completed: true } },
          },
        },
      },
    }),
    prisma.answer.findMany({
      include: {
        question: { select: { type: true, label: true } },
      },
    }),
    prisma.taskResult.findMany({
      where: { completed: true },
      select: { durationSeconds: true },
    }),
  ]);

  const completionRate =
    allSessions > 0 ? Math.round((completedSessions / allSessions) * 100) : 0;

  // SEQ: scale1to5 questions with label containing easy/difficult/seq
  const seqValues = seqAnswers
    .filter((a) => {
      if (a.question.type !== "scale1to5") return false;
      const lower = a.question.label.toLowerCase();
      return lower.includes("easy") || lower.includes("difficult") || lower.includes("seq");
    })
    .map((a) => {
      const v = a.value;
      if (typeof v === "number") return v;
      if (typeof v === "object" && v !== null && "value" in (v as object)) return Number((v as { value: unknown }).value);
      return null;
    })
    .filter((v): v is number => v !== null);

  const avgSeqScore =
    seqValues.length > 0
      ? Math.round((seqValues.reduce((s, v) => s + v, 0) / seqValues.length) * 10) / 10
      : null;

  const avgTimeOnTask =
    taskDurations.length > 0
      ? Math.round(taskDurations.reduce((s, t) => s + t.durationSeconds, 0) / taskDurations.length)
      : null;

  // Drop-off rate: sessions that started but never completed
  const dropOffRate =
    allSessions > 0
      ? Math.round(((allSessions - completedSessions) / allSessions) * 100)
      : null;

  const taskDropOffByTest = testsWithTasks.map((test) => ({
    testId: test.id,
    testTitle: test.title,
    tasks: test.tasks.map((task) => {
      const total = task.results.length;
      const completed = task.results.filter((r) => r.completed).length;
      return {
        taskId: task.id,
        order: task.order,
        instructionText: task.instructionText,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : null,
      };
    }),
  }));

  return NextResponse.json({
    stats: {
      activeTests,
      totalParticipants: allSessions,
      pendingReviews,
      completionRate,
    },
    avgSeqScore,
    avgTimeOnTask,
    dropOffRate,
    completionTrend: trend.map((r) => ({
      date: r.date,
      completions: Number(r.completions),
    })),
    recentFlaggedSessions: flaggedSessions.map((s) => ({
      id: s.id,
      testTitle: s.test.title,
      prolificPid: s.prolificPid,
      source: s.source,
      totalDuration: s.totalDuration,
      flagged: s.flagged,
      validity: s.validity,
      startTime: s.startTime,
    })),
    sourceBreakdown: sourceBreakdown.map((r) => ({
      source: r.source,
      count: r._count._all,
    })),
    taskDropOffByTest,
  });
}
