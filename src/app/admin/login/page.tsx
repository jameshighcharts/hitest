"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // handle logout via query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout") === "1") {
      fetch("/api/admin/login", { method: "DELETE" }).finally(() => {
        router.replace("/admin/login");
      });
    }
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow max-w-sm w-full space-y-4"
      >
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-accent text-white rounded px-4 py-2 font-medium"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
