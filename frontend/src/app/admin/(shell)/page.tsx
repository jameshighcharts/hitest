import Link from "next/link";
import dynamic from "next/dynamic";
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
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

const DashboardCharts = dynamic(
  () => import("@/components/dashboard/DashboardCharts"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[268px] animate-pulse rounded-lg bg-muted" />
          <div className="h-[268px] animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[268px] animate-pulse rounded-lg bg-muted" />
          <div className="h-[268px] animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    ),
  }
);

// ── Dummy stats ───────────────────────────────────────────────────────────────

const STATS = {
  activeTests: 8,
  totalParticipants: 247,
  completionRate: 73,
  avgTimeOnTask: 272,
  avgSeqScore: 3.8,
  dropOffRate: 27,
  pendingReviews: 5,
};

function formatTime(secs: number) {
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
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
    { label: "Active Tests",       value: STATS.activeTests,                  icon: BarChart3 },
    { label: "Total Participants", value: STATS.totalParticipants,            icon: Users },
    { label: "Completion Rate",    value: `${STATS.completionRate}%`,         icon: CheckCircle2 },
    { label: "Avg Time on Task",   value: formatTime(STATS.avgTimeOnTask),    icon: Clock },
    { label: "Avg SEQ Score",      value: STATS.avgSeqScore.toFixed(1),       icon: Star,         sub: "out of 5" },
    { label: "Drop-off Rate",      value: `${STATS.dropOffRate}%`,            icon: TrendingDown, sub: "incomplete sessions" },
    { label: "Pending Reviews",    value: STATS.pendingReviews,               icon: AlertTriangle, sub: "flagged sessions" },
  ];

  return (
    <div className="flex flex-col gap-6">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} sub={s.sub} />
        ))}
      </div>

      <DashboardCharts />
    </div>
  );
}
