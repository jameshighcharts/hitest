import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const testId = params.id;
  const isPublic = req.nextUrl.searchParams.get("public") === "1";

  if (!isPublic) {
    const auth = requireAdminApi(req);
    if (auth) return auth;
  }

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      tasks: { orderBy: { order: "asc" } },
      questions: { orderBy: { order: "asc" } },
    },
  });

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (isPublic && test.status !== "published") {
    return NextResponse.json({ error: "Not published" }, { status: 403 });
  }

  return NextResponse.json({ test });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (auth) return auth;

  const body = await req.json();
  const { title, description, githubDemoUrl, completionCode, status, minTotalSeconds } = body;

  const test = await prisma.test.update({
    where: { id: params.id },
    data: {
      title,
      description,
      githubDemoUrl,
      completionCode,
      status,
      minTotalSeconds: minTotalSeconds ? Number(minTotalSeconds) : null,
    },
  });

  return NextResponse.json({ test });
}
