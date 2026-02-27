import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "anon";
  if (!rateLimit(`complete:${ip}`, 50, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const { sessionId, taskResults, answers, totalDuration } = body as {
    sessionId?: string;
    taskResults?: { taskId: string; durationSeconds: number; blurCount?: number }[];
    answers?: { questionId: string; value: any }[];
    totalDuration?: number;
  };

  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

  const session = await prisma.testSession.findUnique({
    where: { id: sessionId },
    include: { test: true },
  });

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.endTime) return NextResponse.json({ error: "Already completed" }, { status: 409 });

  const now = new Date();
  const computedDuration = totalDuration || Math.max(1, Math.round((now.getTime() - session.startTime.getTime()) / 1000));
  const flagged = session.test.minTotalSeconds ? computedDuration < session.test.minTotalSeconds : false;

  await prisma.$transaction([
    prisma.testSession.update({
      where: { id: sessionId },
      data: {
        endTime: now,
        totalDuration: computedDuration,
        flagged,
      },
    }),
    ...(taskResults?.map((t) =>
      prisma.taskResult.create({
        data: {
          taskId: t.taskId,
          durationSeconds: Math.round(t.durationSeconds),
          blurCount: t.blurCount ?? null,
          testSessionId: sessionId,
        },
      })
    ) || []),
    ...(answers?.map((a) =>
      prisma.answer.create({
        data: { questionId: a.questionId, value: a.value, testSessionId: sessionId },
      })
    ) || []),
  ]);

  return NextResponse.json({ ok: true, flagged });
}
