"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SourceEntry {
  source: string;
  count: number;
}

const COLORS = [
  "hsl(235 74% 76%)",
  "hsl(235 50% 87%)",
  "hsl(235 30% 65%)",
  "hsl(235 15% 80%)",
];

export function SourceBreakdownChart({ data }: { data: SourceEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No session data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="source"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={36}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#ffffff",
            border: "1px solid hsl(240 12% 89%)",
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(val) => (
            <span style={{ fontSize: 12, color: "hsl(236 15% 58%)" }}>{val}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
