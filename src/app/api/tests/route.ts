import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";
import { rateLimit } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth) return auth;

  const tests = await prisma.test.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ tests });
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth) return auth;

  const ip = req.ip ?? "anon";
  if (!rateLimit(`create-test:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const { title, description, githubDemoUrl, completionCode, minTotalSeconds } = body;
  if (!title || !githubDemoUrl || !completionCode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const test = await prisma.test.create({
    data: {
      title,
      description,
      githubDemoUrl,
      completionCode,
      status: "draft",
      minTotalSeconds: minTotalSeconds ? Number(minTotalSeconds) : null,
    },
  });

  return NextResponse.json({ test });
}
