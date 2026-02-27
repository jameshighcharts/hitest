export default function MissingParams() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded shadow max-w-md text-center space-y-3">
        <h1 className="text-xl font-semibold">Missing Prolific parameters</h1>
        <p className="text-slate-600 text-sm">
          This study link must include PROLIFIC_PID, STUDY_ID, and SESSION_ID. Please return to Prolific and launch the study link again.
        </p>
      </div>
    </main>
  );
}
