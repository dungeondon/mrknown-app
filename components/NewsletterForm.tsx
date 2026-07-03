"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("loading");
      setMessage("");

      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data: { error?: string } = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("You're in! Watch your inbox for the best deals.");
          setEmail("");
        } else {
          setStatus("error");
          setMessage(data.error ?? "Something went wrong.");
        }
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    },
    [email],
  );

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm font-medium text-center"
      >
        ✓ {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex gap-3 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        required
        autoComplete="email"
        className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>

      {status === "error" && message && (
        <p role="alert" className="text-red-500 text-xs mt-1 col-span-2">
          {message}
        </p>
      )}
    </form>
  );
}
