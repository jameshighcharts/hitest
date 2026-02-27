"use client";

import { Chart, Credits } from "@highcharts/react";
import { AreaSeries } from "@highcharts/react/series/Area";

interface TrendPoint {
  date: string;
  completions: number;
}

export function CompletionTrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No completions in the last 30 days
      </div>
    );
  }

  const categories = data.map((d) =>
    new Date(d.date).toLocaleDateString("en-GB", { month: "short", day: "numeric" })
  );

  return (
    <Chart
      containerProps={{ style: { width: "100%" } }}
      options={{
        chart: {
          height: 200,
          backgroundColor: "transparent",
          style: { fontFamily: "inherit" },
          margin: [4, 8, 28, 32],
        },
        xAxis: {
          categories,
          tickLength: 0,
          lineWidth: 0,
          gridLineWidth: 0,
          labels: {
            style: { color: "hsl(236, 12%, 58%)", fontSize: "11px" },
            step: Math.max(1, Math.ceil(data.length / 6)),
          },
        },
        yAxis: {
          title: { text: undefined },
          gridLineColor: "hsl(240, 12%, 89%)",
          gridLineDashStyle: "Dash",
          tickAmount: 4,
          allowDecimals: false,
          labels: {
            style: { color: "hsl(236, 12%, 58%)", fontSize: "11px" },
          },
        },
        tooltip: {
          backgroundColor: "#ffffff",
          borderColor: "hsl(240, 12%, 89%)",
          borderRadius: 6,
          shadow: false,
          style: { fontSize: "12px", color: "hsl(236, 20%, 38%)" },
          headerFormat: '<span style="font-size:11px">{point.key}</span><br/>',
          pointFormat: "Completions: <b>{point.y}</b>",
        },
        legend: { enabled: false },
        credits: { enabled: false },
      }}
    >
      <AreaSeries
        data={data.map((d) => d.completions)}
        options={{
          name: "Completions",
          color: "hsl(235, 74%, 76%)",
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "hsla(235, 74%, 76%, 0.35)"],
              [1, "hsla(235, 74%, 76%, 0)"],
            ] as Array<[number, string]>,
          },
          lineWidth: 2,
          marker: {
            enabled: false,
            states: { hover: { enabled: true, radius: 4 } },
          },
          states: { hover: { lineWidthPlus: 0 } },
        }}
      />
      <Credits enabled={false} />
    </Chart>
  );
}
