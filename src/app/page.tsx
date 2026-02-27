import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-semibold">HiTest Platform</h1>
      <p className="text-slate-700">Minimal self-hosted usability testing with Prolific support.</p>
      <div className="flex gap-4">
        <Link
          href="/admin"
          className="rounded bg-accent text-white px-4 py-2 text-sm font-medium shadow"
        >
          Go to Admin
        </Link>
        <Link href="https://app.prolific.com" className="text-sm underline text-slate-700">
          Prolific
        </Link>
      </div>
    </main>
  );
}
