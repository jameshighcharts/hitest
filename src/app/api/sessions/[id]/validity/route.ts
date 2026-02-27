import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdminApi(req);
  if (auth) return auth;

  const { id } = params;
  const body = await req.json();
  const { validity } = body as { validity?: string };

  if (!validity || !["pending", "approved", "rejected"].includes(validity)) {
    return NextResponse.json(
      { error: "validity must be pending, approved, or rejected" },
      { status: 400 }
    );
  }

  const session = await prisma.testSession.update({
    where: { id },
    data: { validity: validity as "pending" | "approved" | "rejected" },
    select: { id: true, validity: true },
  });

  return NextResponse.json({ session });
}
