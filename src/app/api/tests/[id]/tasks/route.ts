import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (auth) return auth;
  const body = await req.json();
  const { instructionText, minTimeSeconds, order } = body;
  if (!instructionText) return NextResponse.json({ error: "instructionText required" }, { status: 400 });
  const task = await prisma.task.create({
    data: {
      instructionText,
      minTimeSeconds: minTimeSeconds ? Number(minTimeSeconds) : null,
      order: order || 1,
      testId: params.id,
    },
  });
  return NextResponse.json({ task });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (auth) return auth;
  const body = await req.json();
  const { id, instructionText, minTimeSeconds, order } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const task = await prisma.task.update({
    where: { id },
    data: {
      instructionText,
      minTimeSeconds: minTimeSeconds === null ? null : minTimeSeconds ? Number(minTimeSeconds) : undefined,
      order,
    },
  });
  return NextResponse.json({ task });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (auth) return auth;
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
