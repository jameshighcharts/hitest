import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskCompletionBar } from "./TaskCompletionBar";

interface TaskBreakdown {
  taskId: string;
  order: number;
  instructionText: string;
  completionRate: number | null;
  avgDurationSeconds: number | null;
  avgBlurCount: number | null;
}

function formatSeconds(s: number | null) {
  if (s === null) return "—";
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export function TaskBreakdownTab({ tasks }: { tasks: TaskBreakdown[] }) {
  if (tasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No task data yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Instruction</TableHead>
          <TableHead>Completion Rate</TableHead>
          <TableHead>Avg Time</TableHead>
          <TableHead>Avg Blurs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.taskId}>
            <TableCell className="text-muted-foreground">{task.order}</TableCell>
            <TableCell className="max-w-[320px]">
              <span className="line-clamp-2 text-sm">{task.instructionText}</span>
            </TableCell>
            <TableCell>
              <TaskCompletionBar value={task.completionRate} />
            </TableCell>
            <TableCell className="text-sm tabular-nums">
              {formatSeconds(task.avgDurationSeconds)}
            </TableCell>
            <TableCell className="text-sm tabular-nums">
              {task.avgBlurCount !== null ? task.avgBlurCount.toFixed(1) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
