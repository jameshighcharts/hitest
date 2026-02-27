import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (auth) return auth;
  const body = await req.json();
  const { label, type, options, required = true, order } = body;
  if (!label || !type) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const question = await prisma.question.create({
    data: {
      label,
      type,
      options: options ?? null,
      required,
      order: order || 1,
      testId: params.id,
    },
  });
  return NextResponse.json({ question });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (auth) return auth;
  const body = await req.json();
  const { id, label, type, options, required = true, order } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const question = await prisma.question.update({
    where: { id },
    data: {
      label,
      type,
      options: options ?? null,
      required,
      order,
    },
  });
  return NextResponse.json({ question });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (auth) return auth;
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.question.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
