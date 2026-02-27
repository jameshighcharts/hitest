import Link from "next/link";
import { Plus, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Dummy data ────────────────────────────────────────────────────────────────

const TESTS = [
  {
    id: "test-1",
    title: "Navigation Usability Study",
    status: "published",
    createdAt: "2026-01-15",
    _count: { sessions: 84, tasks: 5, questions: 8 },
  },
  {
    id: "test-2",
    title: "Checkout Flow Evaluation",
    status: "published",
    createdAt: "2026-01-28",
    _count: { sessions: 62, tasks: 3, questions: 6 },
  },
  {
    id: "test-3",
    title: "Onboarding Experience Test",
    status: "published",
    createdAt: "2026-02-03",
    _count: { sessions: 51, tasks: 4, questions: 7 },
  },
  {
    id: "test-4",
    title: "Search & Filter Study",
    status: "published",
    createdAt: "2026-02-10",
    _count: { sessions: 38, tasks: 4, questions: 5 },
  },
  {
    id: "test-5",
    title: "Mobile Menu Prototype",
    status: "draft",
    createdAt: "2026-02-19",
    _count: { sessions: 0, tasks: 3, questions: 4 },
  },
  {
    id: "test-6",
    title: "Dashboard Redesign Feedback",
    status: "draft",
    createdAt: "2026-02-24",
    _count: { sessions: 0, tasks: 6, questions: 10 },
  },
  {
    id: "test-7",
    title: "Account Settings Walkthrough",
    status: "closed",
    createdAt: "2025-11-12",
    _count: { sessions: 120, tasks: 5, questions: 9 },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusVariant: Record<string, "success" | "secondary" | "destructive"> = {
  published: "success",
  draft: "secondary",
  closed: "destructive",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Tests</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your HiTest assessments
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tests/new">
            <Plus className="size-4" />
            New Test
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
          <CardDescription>{TESTS.length} tests total</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Tasks</TableHead>
                <TableHead className="text-center">Questions</TableHead>
                <TableHead className="text-center">Participants</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[52px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TESTS.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[test.status] ?? "secondary"}>
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{test._count.tasks}</TableCell>
                  <TableCell className="text-center">{test._count.questions}</TableCell>
                  <TableCell className="text-center">{test._count.sessions}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(test.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/tests/${test.id}`}>
                        <BarChart2 className="size-4" />
                        <span className="sr-only">Analytics</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
