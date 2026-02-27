"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TaskEntry {
  taskId: string;
  order: number;
  instructionText: string;
  completionRate: number | null;
}

interface TestFunnel {
  testId: string;
  testTitle: string;
  tasks: TaskEntry[];
}

function barColor(rate: number | null) {
  if (rate === null) return "hsl(236 15% 80%)";
  if (rate >= 80) return "hsl(142 71% 45%)";
  if (rate >= 50) return "hsl(38 92% 50%)";
  return "hsl(0 84% 60%)";
}

export function TaskFunnelByTest({ data }: { data: TestFunnel[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No published tests with task data
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {data.slice(0, 3).map((test) => {
        const chartData = test.tasks.map((t) => ({
          name: `T${t.order}`,
          rate: t.completionRate ?? 0,
          label: t.instructionText.slice(0, 40) + (t.instructionText.length > 40 ? "…" : ""),
          completionRate: t.completionRate,
        }));

        return (
          <div key={test.testId}>
            <p className="mb-2 text-xs font-medium text-muted-foreground truncate">{test.testTitle}</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(240 12% 89%)" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "hsl(236 12% 58%)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "hsl(236 12% 58%)" }}
                  tickLine={false}
                  axisLine={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid hsl(240 12% 89%)",
                    borderRadius: 6,
                    fontSize: 11,
                  }}
                  formatter={(value, _name, props) => [
                    `${value}%`,
                    props.payload?.label ?? "Completion",
                  ]}
                />
                <Bar dataKey="rate" radius={[0, 3, 3, 0]} maxBarSize={14}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.completionRate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
