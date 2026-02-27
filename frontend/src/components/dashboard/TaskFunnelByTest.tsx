"use client";

import type { Point } from "highcharts";
import { Chart, Credits } from "@highcharts/react";
import { BarSeries } from "@highcharts/react/series/Bar";

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

function barColor(rate: number | null): string {
  if (rate === null) return "hsl(236, 15%, 80%)";
  if (rate >= 80) return "hsl(142, 71%, 45%)";
  if (rate >= 50) return "hsl(38, 92%, 50%)";
  return "hsl(0, 84%, 60%)";
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
        const pointData = test.tasks.map((t) => ({
          name: `T${t.order}`,
          y: t.completionRate ?? 0,
          color: barColor(t.completionRate),
          label:
            t.instructionText.slice(0, 40) +
            (t.instructionText.length > 40 ? "…" : ""),
        }));

        return (
          <div key={test.testId}>
            <p className="mb-2 text-xs font-medium text-muted-foreground truncate">
              {test.testTitle}
            </p>
            <Chart
              containerProps={{ style: { width: "100%" } }}
              options={{
                chart: {
                  height: Math.max(120, test.tasks.length * 26 + 40),
                  backgroundColor: "transparent",
                  style: { fontFamily: "inherit" },
                  margin: [8, 20, 30, 52],
                },
                xAxis: {
                  categories: pointData.map((d) => d.name),
                  tickLength: 0,
                  lineWidth: 0,
                  gridLineWidth: 0,
                  labels: {
                    style: { color: "hsl(236, 12%, 58%)", fontSize: "11px" },
                    x: -4,
                  },
                },
                yAxis: {
                  min: 0,
                  max: 100,
                  title: { text: undefined },
                  gridLineColor: "hsl(240, 12%, 89%)",
                  gridLineDashStyle: "Dash",
                  labels: {
                    format: "{value}%",
                    style: { color: "hsl(236, 12%, 58%)", fontSize: "10px" },
                    y: 12,
                  },
                },
                tooltip: {
                  backgroundColor: "#ffffff",
                  borderColor: "hsl(240, 12%, 89%)",
                  borderRadius: 6,
                  shadow: false,
                  useHTML: true,
                  style: { fontSize: "11px", color: "hsl(236, 20%, 38%)" },
                  formatter: function (this: Point) {
                    const d = pointData[this.index];
                    return `${d.label}<br/><b>${this.y}%</b>`;
                  },
                },
                plotOptions: {
                  bar: {
                    borderRadius: 3,
                    maxPointWidth: 14,
                    colorByPoint: true,
                  },
                },
                legend: { enabled: false },
                credits: { enabled: false },
              }}
            >
              <BarSeries
                data={pointData}
                options={{ name: "Completion", colorByPoint: true }}
              />
              <Credits enabled={false} />
            </Chart>
          </div>
        );
      })}
    </div>
  );
}
