import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";

function csvEscape(val: any) {
  if (val === null || val === undefined) return "";
  const str = typeof val === "string" ? val : JSON.stringify(val);
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (auth) return auth;

  const test = await prisma.test.findUnique({
    where: { id: params.id },
    include: {
      tasks: { orderBy: { order: "asc" } },
      questions: { orderBy: { order: "asc" } },
      sessions: {
        include: {
          taskResults: true,
          answers: true,
        },
      },
    },
  });

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const headers: string[] = [
    "prolificPid",
    "studyId",
    "sessionId",
    "totalDuration",
    "flagged",
  ];
  test.tasks.forEach((t) => {
    headers.push(`task_${t.order}_duration`);
    headers.push(`task_${t.order}_blurs`);
  });
  test.questions.forEach((q) => headers.push(`q_${q.order}_${q.label.replace(/\s+/g, "_")}`));

  const rows = [headers.join(",")];

  for (const session of test.sessions) {
    const row: any[] = [
      session.prolificPid,
      session.studyId,
      session.sessionId,
      session.totalDuration ?? "",
      session.flagged ? "1" : "0",
    ];

    test.tasks.forEach((task) => {
      const result = session.taskResults.find((r) => r.taskId === task.id);
      row.push(result?.durationSeconds ?? "");
      row.push(result?.blurCount ?? "");
    });

    test.questions.forEach((q) => {
      const ans = session.answers.find((a) => a.questionId === q.id);
      row.push(ans ? JSON.stringify(ans.value) : "");
    });

    rows.push(row.map(csvEscape).join(","));
  }

  const csv = rows.join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=results-${test.id}.csv`,
    },
  });
}
