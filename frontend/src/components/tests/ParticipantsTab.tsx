"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

type Validity = "pending" | "approved" | "rejected";

interface Participant {
  sessionId: string;
  prolificPid: string;
  source: string;
  startTime: string;
  endTime: string | null;
  totalDuration: number | null;
  flagged: boolean;
  validity: Validity;
  seqScore: number | null;
  completedTaskCount: number;
  totalTaskCount: number;
}

function formatDuration(s: number | null) {
  if (s === null) return "—";
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

const VALIDITY_OPTIONS: Validity[] = ["approved", "pending", "rejected"];

export function ParticipantsTab({ participants: initial }: { participants: Participant[] }) {
  const [rows, setRows] = useState(initial);

  async function setValidity(sessionId: string, validity: Validity) {
    const prev = rows.find((r) => r.sessionId === sessionId)?.validity;
    setRows((r) => r.map((p) => p.sessionId === sessionId ? { ...p, validity } : p));
    try {
      await apiFetch(`/api/sessions/${sessionId}/validity`, {
        method: "PATCH",
        body: JSON.stringify({ validity }),
      });
    } catch {
      // revert on error
      setRows((r) => r.map((p) => p.sessionId === sessionId ? { ...p, validity: prev! } : p));
    }
  }

  if (rows.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No participants yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prolific PID</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>SEQ</TableHead>
            <TableHead>Flagged</TableHead>
            <TableHead>Validity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((p) => (
            <TableRow key={p.sessionId}>
              <TableCell className="font-mono text-xs">{p.prolificPid}</TableCell>
              <TableCell className="text-sm">{p.source}</TableCell>
              <TableCell className="text-sm tabular-nums">{formatDuration(p.totalDuration)}</TableCell>
              <TableCell className="text-sm tabular-nums">
                {p.completedTaskCount}/{p.totalTaskCount}
              </TableCell>
              <TableCell className="text-sm tabular-nums">
                {p.seqScore !== null ? p.seqScore.toFixed(1) : "—"}
              </TableCell>
              <TableCell>
                {p.flagged ? (
                  <Badge variant="destructive" className="text-xs">flagged</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {VALIDITY_OPTIONS.map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={p.validity === v ? "default" : "outline"}
                      className="h-6 px-2 text-xs capitalize"
                      onClick={() => setValidity(p.sessionId, v)}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Button>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
