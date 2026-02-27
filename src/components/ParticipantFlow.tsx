"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  test: {
    id: string;
    title: string;
    description: string | null;
    githubDemoUrl: string;
    completionCode: string;
    status: "draft" | "published";
    minTotalSeconds: number | null;
    tasks: {
      id: string;
      instructionText: string;
      minTimeSeconds: number | null;
      order: number;
    }[];
    questions: {
      id: string;
      type: "text" | "textarea" | "multipleChoice" | "scale1to5";
      label: string;
      options: any;
      required: boolean;
      order: number;
    }[];
  };
  prolificPid: string;
  studyId: string;
  sessionId: string;
  preview?: boolean;
};

type TaskTiming = { taskId: string; durationSeconds: number; blurCount: number };

export default function ParticipantFlow({ test, prolificPid, studyId, sessionId, preview = false }: Props) {
  const [step, setStep] = useState<"welcome" | "task" | "questions" | "submit">("welcome");
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [taskTimings, setTaskTimings] = useState<TaskTiming[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [consent, setConsent] = useState(false);
  const [sessionRecord, setSessionRecord] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const router = useRouter();

  const taskStartRef = useRef<number | null>(null);
  const blurCountRef = useRef(0);

  // create session (skip network in preview mode)
  useEffect(() => {
    if (preview) {
      setSessionRecord({ id: "preview" });
      return;
    }

    const start = async () => {
      const res = await fetch("/api/sessions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: test.id, prolificPid, studyId, sessionId, userAgent: navigator.userAgent }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessionRecord(data.session);
      } else {
        const data = await res.json();
        setError(data.error || "Unable to start session");
      }
    };
    start();
  }, [preview, prolificPid, sessionId, studyId, test.id]);

  // focus/blur tracking per task
  useEffect(() => {
    const onBlur = () => {
      blurCountRef.current += 1;
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  const currentTask = useMemo(() => test.tasks[currentTaskIdx], [test.tasks, currentTaskIdx]);

  const startTaskTimer = () => {
    taskStartRef.current = performance.now();
    blurCountRef.current = 0;
    setElapsedSeconds(0);
  };

  const finishTaskTimer = () => {
    if (!taskStartRef.current || !currentTask) return;
    const elapsedMs = performance.now() - taskStartRef.current;
    const durationSeconds = Math.round(elapsedMs / 1000);
    setTaskTimings((prev) => [...prev, { taskId: currentTask.id, durationSeconds, blurCount: blurCountRef.current }]);
    taskStartRef.current = null;
  };

  const startQuestions = () => {
    finishTaskTimer();
    setStep("questions");
  };

  const nextTask = () => {
    finishTaskTimer();
    const nextIdx = currentTaskIdx + 1;
    if (nextIdx < test.tasks.length) {
      setCurrentTaskIdx(nextIdx);
      setTimeout(startTaskTimer, 10);
    } else {
      setStep("questions");
    }
  };

  // track live elapsed time for current task
  useEffect(() => {
    if (step !== "task") return;
    const interval = setInterval(() => {
      if (taskStartRef.current) {
        setElapsedSeconds(Math.floor((performance.now() - taskStartRef.current) / 1000));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [step, currentTaskIdx]);

  const submit = async () => {
    if (!sessionRecord) return;
    setSubmitting(true);

    if (preview) {
      // do not hit APIs; just show success preview
      setTimeout(() => {
        setSubmitting(false);
        alert("Preview submission captured locally (no data saved).");
      }, 200);
      return;
    }

    const payload = {
      sessionId: sessionRecord.id,
      taskResults: taskTimings.map(({ taskId, durationSeconds, blurCount }) => ({ taskId, durationSeconds, blurCount })),
      answers: test.questions.map((q) => ({ questionId: q.id, value: answers[q.id] ?? null })),
    };

    const res = await fetch("/api/sessions/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Unable to submit");
      setSubmitting(false);
      return;
    }

    const completionUrl = `https://app.prolific.com/submissions/complete?cc=${test.completionCode}`;
    router.replace(completionUrl);
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!sessionRecord) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <p className="text-slate-700">Preparing your session…</p>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {preview && (
          <div className="rounded bg-yellow-100 text-yellow-900 px-3 py-2 text-sm">
            Preview mode — no data will be saved.
          </div>
        )}
        <h1 className="text-2xl font-semibold">{test.title}</h1>
        <p className="text-slate-700 whitespace-pre-line">{test.description}</p>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          I consent to participate in this usability test.
        </label>
        <button
          className="bg-accent text-white rounded px-4 py-2 text-sm font-medium"
          disabled={!consent}
          onClick={() => {
            if (test.tasks.length === 0) {
              setStep("questions");
              return;
            }
            setStep("task");
            setTimeout(startTaskTimer, 10);
          }}
        >
          Start
        </button>
      </div>
    );
  }

  if (step === "task" && currentTask) {
    const minTime = currentTask.minTimeSeconds || 0;
    const canProceed = minTime === 0 || elapsedSeconds >= minTime;

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div>
          <p className="text-sm text-slate-500">Task {currentTaskIdx + 1} of {test.tasks.length}</p>
          <h2 className="text-xl font-semibold">{currentTask.instructionText}</h2>
          {minTime ? <p className="text-xs text-orange-600">Minimum time: {minTime}s</p> : null}
          {minTime ? <p className="text-xs text-slate-500">Elapsed: {elapsedSeconds}s</p> : null}
        </div>
        <div className="border rounded overflow-hidden bg-white shadow">
          <iframe src={test.githubDemoUrl} className="w-full h-[480px]" allowFullScreen title="Prototype" />
        </div>
        <div className="text-sm text-slate-700 space-x-3">
          <a href={test.githubDemoUrl} target="_blank" rel="noreferrer" className="underline">Open in new tab</a>
          <button
            className="bg-accent text-white rounded px-4 py-2 text-sm font-medium"
            onClick={nextTask}
            disabled={!canProceed}
          >
            {currentTaskIdx + 1 === test.tasks.length ? "Continue to questions" : "Next task"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep("submit");
            submit();
          }}
        >
          {test.questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="block font-medium">{q.label}</label>
              {q.type === "text" && (
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  required={q.required}
                />
              )}
              {q.type === "textarea" && (
                <textarea
                  className="border rounded px-3 py-2 w-full"
                  rows={3}
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  required={q.required}
                />
              )}
              {q.type === "multipleChoice" && Array.isArray(q.options) && (
                <div className="space-y-1">
                  {q.options.map((opt: string) => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        required={q.required}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "scale1to5" && (
                <div className="flex gap-3 text-sm">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={q.id}
                        value={n}
                        checked={Number(answers[q.id]) === n}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: Number(e.target.value) }))}
                        required={q.required}
                      />
                      {n}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="submit" className="bg-accent text-white rounded px-4 py-2 text-sm font-medium">
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-4">
      <p className="text-slate-700">
        {preview ? "Preview submission (no data saved)" : "Submitting your responses…"}
      </p>
      <button
        className="bg-accent text-white rounded px-4 py-2 text-sm font-medium"
        onClick={submit}
        disabled={submitting}
      >
        Finish
      </button>
    </div>
  );
}
