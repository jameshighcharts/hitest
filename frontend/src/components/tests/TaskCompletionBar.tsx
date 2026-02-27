import { cn } from "@/lib/utils";

interface TaskCompletionBarProps {
  value: number | null;
  className?: string;
}

export function TaskCompletionBar({ value, className }: TaskCompletionBarProps) {
  if (value === null) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const colorClass =
    value >= 80
      ? "bg-green-500"
      : value >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", colorClass)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">{value}%</span>
    </div>
  );
}
