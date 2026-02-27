import Link from "next/link";
import {
  Plus,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  TrendingDown,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompletionTrendChart } from "@/components/dashboard/CompletionTrendChart";
import { SourceBreakdownChart } from "@/components/dashboard/SourceBreakdownChart";
import { FlaggedSessionsFeed } from "@/components/dashboard/FlaggedSessionsFeed";
import { TaskFunnelByTest } from "@/components/dashboard/TaskFunnelByTest";

// ── Dummy data ────────────────────────────────────────────────────────────────

const STATS = {
  activeTests: 8,
  totalParticipants: 247,
  completionRate: 73,
  avgTimeOnTask: 272,   // seconds
  avgSeqScore: 3.8,
  dropOffRate: 27,
  pendingReviews: 5,
};

const TREND = [
  { date: "2026-01-29", completions: 4 },
  { date: "2026-01-30", completions: 7 },
  { date: "2026-01-31", completions: 5 },
  { date: "2026-02-01", completions: 11 },
  { date: "2026-02-02", completions: 8 },
  { date: "2026-02-03", completions: 3 },
  { date: "2026-02-04", completions: 0 },
  { date: "2026-02-05", completions: 9 },
  { date: "2026-02-06", completions: 13 },
  { date: "2026-02-07", completions: 16 },
  { date: "2026-02-08", completions: 10 },
  { date: "2026-02-09", completions: 7 },
  { date: "2026-02-10", completions: 4 },
  { date: "2026-02-11", completions: 2 },
  { date: "2026-02-12", completions: 12 },
  { date: "2026-02-13", completions: 15 },
  { date: "2026-02-14", completions: 18 },
  { date: "2026-02-15", completions: 11 },
  { date: "2026-02-16", completions: 9 },
  { date: "2026-02-17", completions: 6 },
  { date: "2026-02-18", completions: 4 },
  { date: "2026-02-19", completions: 14 },
  { date: "2026-02-20", completions: 17 },
  { date: "2026-02-21", completions: 19 },
  { date: "2026-02-22", completions: 13 },
  { date: "2026-02-23", completions: 8 },
  { date: "2026-02-24", completions: 5 },
  { date: "2026-02-25", completions: 2 },
  { date: "2026-02-26", completions: 11 },
  { date: "2026-02-27", completions: 6 },
];

const SOURCE_BREAKDOWN = [
  { source: "Prolific", count: 189 },
  { source: "internal", count: 41 },
  { source: "maze", count: 17 },
];

const FLAGGED_SESSIONS = [
  { id: "s1", testTitle: "Navigation Usability Study", prolificPid: "5e4a12bc", source: "prolific",  totalDuration: 48, flagged: true, validity: "pending", startTime: "2026-02-27T09:14:00Z" },
  { id: "s2", testTitle: "Checkout Flow Evaluation",   prolificPid: "6f3b29de", source: "prolific",  totalDuration: 31, flagged: true, validity: "rejected", startTime: "2026-02-26T14:52:00Z" },
  { id: "s3", testTitle: "Onboarding Experience Test", prolificPid: "7a1c44ef", source: "prolific",  totalDuration: 55, flagged: true, validity: "pending", startTime: "2026-02-26T11:08:00Z" },
  { id: "s4", testTitle: "Navigation Usability Study", prolificPid: "8b2d55fa", source: "internal", totalDuration: 42, flagged: true, validity: "approved", startTime: "2026-02-25T16:33:00Z" },
  { id: "s5", testTitle: "Checkout Flow Evaluation",   prolificPid: "9c3e66ab", source: "maze",     totalDuration: 27, flagged: true, validity: "pending", startTime: "2026-02-25T10:21:00Z" },
  { id: "s6", testTitle: "Search & Filter Study",      prolificPid: "0d4f77bc", source: "prolific",  totalDuration: 38, flagged: true, validity: "pending", startTime: "2026-02-24T09:05:00Z" },
];

const FUNNEL = [
  {
    testId: "t1",
    testTitle: "Navigation Usability Study",
    tasks: [
      { taskId: "tk1", order: 1, instructionText: "Find the Settings page",          completionRate: 94 },
      { taskId: "tk2", order: 2, instructionText: "Update your profile picture",     completionRate: 81 },
      { taskId: "tk3", order: 3, instructionText: "Connect a third-party account",   completionRate: 67 },
      { taskId: "tk4", order: 4, instructionText: "Export your account data",        completionRate: 48 },
      { taskId: "tk5", order: 5, instructionText: "Delete a saved address",          completionRate: 41 },
    ],
  },
  {
    testId: "t2",
    testTitle: "Checkout Flow Evaluation",
    tasks: [
      { taskId: "tk6", order: 1, instructionText: "Add two items to cart",           completionRate: 98 },
      { taskId: "tk7", order: 2, instructionText: "Apply a discount code",           completionRate: 72 },
      { taskId: "tk8", order: 3, instructionText: "Complete purchase with new card", completionRate: 55 },
    ],
  },
  {
    testId: "t3",
    testTitle: "Onboarding Experience Test",
    tasks: [
      { taskId: "tk9",  order: 1, instructionText: "Create a new account",           completionRate: 91 },
      { taskId: "tk10", order: 2, instructionText: "Complete the onboarding tour",   completionRate: 76 },
      { taskId: "tk11", order: 3, instructionText: "Invite a team member",           completionRate: 44 },
      { taskId: "tk12", order: 4, instructionText: "Connect your first integration", completionRate: 33 },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const statCards = [
    { label: "Active Tests",        value: STATS.activeTests,                              icon: BarChart3 },
    { label: "Total Participants",  value: STATS.totalParticipants,                        icon: Users },
    { label: "Completion Rate",     value: `${STATS.completionRate}%`,                     icon: CheckCircle2 },
    { label: "Avg Time on Task",    value: formatTime(STATS.avgTimeOnTask),                icon: Clock },
    { label: "Avg SEQ Score",       value: STATS.avgSeqScore.toFixed(1),                   icon: Star,    sub: "out of 5" },
    { label: "Drop-off Rate",       value: `${STATS.dropOffRate}%`,                        icon: TrendingDown, sub: "incomplete sessions" },
    { label: "Pending Reviews",     value: STATS.pendingReviews,                           icon: AlertTriangle, sub: "flagged sessions" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your HiTest platform</p>
        </div>
        <Button asChild>
          <Link href="/admin/tests/new">
            <Plus className="size-4" />
            New Test
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} sub={s.sub} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completions — last 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionTrendChart data={TREND} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Participant Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <SourceBreakdownChart data={SOURCE_BREAKDOWN} />
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Task Drop-off by Test</CardTitle>
            <CardDescription>Completion rate per task across active tests</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskFunnelByTest data={FUNNEL} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Flagged Sessions</CardTitle>
            <CardDescription>Participants who completed unusually fast</CardDescription>
          </CardHeader>
          <CardContent>
            <FlaggedSessionsFeed sessions={FLAGGED_SESSIONS} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
