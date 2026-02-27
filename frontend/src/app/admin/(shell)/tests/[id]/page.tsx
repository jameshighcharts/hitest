import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskBreakdownTab } from "@/components/tests/TaskBreakdownTab";
import { ParticipantsTab } from "@/components/tests/ParticipantsTab";

// ── Dummy data ────────────────────────────────────────────────────────────────

const TEST = {
  id: "test-1",
  title: "Navigation Usability Study",
  status: "published",
  createdAt: "2026-01-15",
  taskCount: 5,
  questionCount: 8,
};

const SUMMARY = {
  totalSessions: 84,
  completedSessions: 61,
  completionRate: 73,
  avgTotalDuration: 487,   // seconds
  avgSeqScore: 3.8,
  pendingReviews: 5,
};

const TASK_BREAKDOWN = [
  { taskId: "tk1", order: 1, instructionText: "Find the Settings page using only the main navigation.", completionRate: 94, avgDurationSeconds: 42,  avgBlurCount: 0.3 },
  { taskId: "tk2", order: 2, instructionText: "Update your profile picture and save.",                  completionRate: 81, avgDurationSeconds: 78,  avgBlurCount: 0.8 },
  { taskId: "tk3", order: 3, instructionText: "Connect a third-party account (Google or GitHub).",      completionRate: 67, avgDurationSeconds: 112, avgBlurCount: 1.4 },
  { taskId: "tk4", order: 4, instructionText: "Export your account data as a CSV file.",                completionRate: 48, avgDurationSeconds: 145, avgBlurCount: 2.1 },
  { taskId: "tk5", order: 5, instructionText: "Delete a saved shipping address from your profile.",     completionRate: 41, avgDurationSeconds: 163, avgBlurCount: 2.7 },
];

const PARTICIPANTS = [
  { sessionId: "s01", prolificPid: "5e4a12bc", source: "prolific", startTime: "2026-02-20T09:10:00Z", endTime: "2026-02-20T09:19:00Z", totalDuration: 534, flagged: false, validity: "approved" as const, seqScore: 4.2, completedTaskCount: 5, totalTaskCount: 5 },
  { sessionId: "s02", prolificPid: "6f3b29de", source: "prolific", startTime: "2026-02-20T10:02:00Z", endTime: "2026-02-20T10:10:00Z", totalDuration: 468, flagged: false, validity: "approved" as const, seqScore: 3.5, completedTaskCount: 5, totalTaskCount: 5 },
  { sessionId: "s03", prolificPid: "7a1c44ef", source: "prolific", startTime: "2026-02-21T11:15:00Z", endTime: "2026-02-21T11:16:00Z", totalDuration:  48, flagged: true,  validity: "pending"  as const, seqScore: 4.8, completedTaskCount: 5, totalTaskCount: 5 },
  { sessionId: "s04", prolificPid: "8b2d55fa", source: "internal", startTime: "2026-02-21T14:33:00Z", endTime: "2026-02-21T14:45:00Z", totalDuration: 712, flagged: false, validity: "approved" as const, seqScore: 2.9, completedTaskCount: 5, totalTaskCount: 5 },
  { sessionId: "s05", prolificPid: "9c3e66ab", source: "prolific", startTime: "2026-02-22T08:50:00Z", endTime: "2026-02-22T08:51:00Z", totalDuration:  31, flagged: true,  validity: "rejected" as const, seqScore: 5.0, completedTaskCount: 5, totalTaskCount: 5 },
  { sessionId: "s06", prolificPid: "0d4f77bc", source: "prolific", startTime: "2026-02-22T13:07:00Z", endTime: null,                   totalDuration: null, flagged: false, validity: "pending"  as const, seqScore: null, completedTaskCount: 3, totalTaskCount: 5 },
  { sessionId: "s07", prolificPid: "1e5a88cd", source: "prolific", startTime: "2026-02-23T09:22:00Z", endTime: "2026-02-23T09:31:00Z", totalDuration: 542, flagged: false, validity: "approved" as const, seqScore: 4.0, completedTaskCount: 5, totalTaskCount: 5 },
  { sessionId: "s08", prolificPid: "2f6b99de", source: "prolific", startTime: "2026-02-23T15:44:00Z", endTime: null,                   totalDuration: null, flagged: false, validity: "pending"  as const, seqScore: null, completedTaskCount: 2, totalTaskCount: 5 },
  { sessionId: "s09", prolificPid: "3a7caaef", source: "prolific", startTime: "2026-02-24T10:05:00Z", endTime: "2026-02-24T10:17:00Z", totalDuration: 727, flagged: false, validity: "approved" as const, seqScore: 3.2, completedTaskCount: 5, totalTaskCount: 5 },
  { sessionId: "s10", prolificPid: "4b8dbbfa", source: "maze",     startTime: "2026-02-25T09:33:00Z", endTime: "2026-02-25T09:34:00Z", totalDuration:  42, flagged: true,  validity: "pending"  as const, seqScore: 4.5, completedTaskCount: 5, totalTaskCount: 5 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(s: number | null) {
  if (s === null) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

const statusVariant: Record<string, "success" | "secondary" | "destructive"> = {
  published: "success",
  draft: "secondary",
  closed: "destructive",
};

const statCards = [
  { label: "Participants",     value: SUMMARY.totalSessions },
  { label: "Completed",        value: SUMMARY.completedSessions },
  { label: "Completion Rate",  value: `${SUMMARY.completionRate}%` },
  { label: "Avg Duration",     value: formatDuration(SUMMARY.avgTotalDuration) },
  { label: "Avg SEQ Score",    value: SUMMARY.avgSeqScore.toFixed(1) },
  { label: "Pending Reviews",  value: SUMMARY.pendingReviews },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TestDetailPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="mt-0.5 shrink-0">
            <Link href="/admin/tests">
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{TEST.title}</h1>
              <Badge variant={statusVariant[TEST.status] ?? "secondary"}>
                {TEST.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {TEST.taskCount} tasks · {TEST.questionCount} questions · Created{" "}
              {new Date(TEST.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detailed Results</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <Tabs defaultValue="tasks" className="px-6">
            <TabsList>
              <TabsTrigger value="tasks">Task Breakdown</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <TaskBreakdownTab tasks={TASK_BREAKDOWN} />
            </TabsContent>
            <TabsContent value="participants">
              <ParticipantsTab participants={PARTICIPANTS} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
