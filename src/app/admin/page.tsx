import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import NewTestForm from "@/components/NewTestForm";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  requireAdmin();
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { sessions: true } } },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tests</h1>
          <p className="text-slate-600">Manage prototypes, tasks, and questions.</p>
        </div>
        <Link href="/admin/login?logout=1" className="text-sm text-slate-500">
          Logout
        </Link>
      </div>
      <NewTestForm />
      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((test) => (
          <Link
            key={test.id}
            href={`/admin/tests/${test.id}`}
            className="block border rounded p-4 bg-white shadow-sm hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{test.title}</h2>
              <span className={`text-xs px-2 py-1 rounded ${
                test.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {test.status}
              </span>
            </div>
            <p className="text-slate-600 text-sm mt-2 line-clamp-2">{test.description}</p>
            <p className="text-xs text-slate-500 mt-3">Completions: {test._count.sessions}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
