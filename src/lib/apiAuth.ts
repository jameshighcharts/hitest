import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function requireAdminApi(req: NextRequest): NextResponse | void {
  const cookie = req.cookies.get("admin_auth")?.value;
  if (!verifyToken(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
