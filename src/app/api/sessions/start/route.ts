import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "anon";
  if (!rateLimit(`start:${ip}`, 50, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const { testId, prolificPid, studyId, sessionId, userAgent, source } = body;
  if (!testId || !prolificPid || !studyId || !sessionId) {
    return NextResponse.json({ error: "Missing Prolific parameters" }, { status: 400 });
  }

  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test || test.status !== "published") {
    return NextResponse.json({ error: "Test not available" }, { status: 404 });
  }

  const existing = await prisma.testSession.findUnique({
    where: { testId_prolificPid: { testId, prolificPid } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already submitted" }, { status: 409 });
  }

  const session = await prisma.testSession.create({
    data: {
      testId,
      prolificPid,
      studyId,
      sessionId,
      userAgent,
      source: source ?? "prolific",
    },
  });

  return NextResponse.json({ session });
}
