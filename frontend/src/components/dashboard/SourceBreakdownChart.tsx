"use client";

import { Chart, Credits } from "@highcharts/react";
import { PieSeries } from "@highcharts/react/series/Pie";

interface SourceEntry {
  source: string;
  count: number;
}

const COLORS = [
  "hsl(235, 74%, 76%)",
  "hsl(235, 50%, 87%)",
  "hsl(235, 30%, 65%)",
  "hsl(235, 15%, 80%)",
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
    <Chart
      containerProps={{ style: { width: "100%" } }}
      options={{
        chart: {
          height: 200,
          backgroundColor: "transparent",
          style: { fontFamily: "inherit" },
        },
        tooltip: {
          backgroundColor: "#ffffff",
          borderColor: "hsl(240, 12%, 89%)",
          borderRadius: 6,
          shadow: false,
          style: { fontSize: "12px", color: "hsl(236, 20%, 38%)" },
          pointFormat: "<b>{point.y}</b> participants ({point.percentage:.1f}%)",
        },
        plotOptions: {
          pie: {
            innerSize: "52%",
            dataLabels: { enabled: false },
            showInLegend: true,
            borderWidth: 0,
          },
        },
        legend: {
          align: "center",
          verticalAlign: "bottom",
          layout: "horizontal",
          itemStyle: {
            fontSize: "12px",
            color: "hsl(236, 15%, 58%)",
            fontWeight: "normal",
            fontFamily: "inherit",
          },
          symbolRadius: 4,
          symbolHeight: 8,
          symbolWidth: 8,
        },
        credits: { enabled: false },
      }}
    >
      <PieSeries
        data={data.map((d, i) => ({
          name: d.source,
          y: d.count,
          color: COLORS[i % COLORS.length],
        }))}
        options={{ name: "Participants" }}
      />
      <Credits enabled={false} />
    </Chart>
  );
}
