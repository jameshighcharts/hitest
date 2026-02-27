import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface FlaggedSession {
  id: string;
  testTitle: string;
  prolificPid: string;
  source: string;
  totalDuration: number | null;
  flagged: boolean;
  validity: string;
  startTime: string;
}

function formatDuration(seconds: number | null) {
  if (seconds === null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

const validityVariant: Record<string, "destructive" | "success" | "secondary"> = {
  rejected: "destructive",
  approved: "success",
  pending: "secondary",
};

export function FlaggedSessionsFeed({ sessions }: { sessions: FlaggedSession[] }) {
  if (sessions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No flagged sessions
      </div>
    );
  }

  return (
    <ScrollArea className="h-64">
      <div className="flex flex-col divide-y divide-border">
        {sessions.map((s) => (
          <div key={s.id} className="flex items-start justify-between gap-3 py-3 text-sm">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-medium text-foreground truncate">{s.testTitle}</span>
              <span className="text-muted-foreground text-xs">{s.prolificPid} · {s.source}</span>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant={validityVariant[s.validity] ?? "secondary"} className="text-xs">
                {s.validity}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatDuration(s.totalDuration)}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
