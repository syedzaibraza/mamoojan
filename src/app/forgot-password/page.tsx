"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Unable to send reset email.");
      }
      setSuccess(true);
      const msg = data.message || "Check your email for reset instructions.";
      setMessage(msg);
      toast.success(msg);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to send reset email.";
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>
        Forgot password
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your email and we will send reset instructions.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-5 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm"
            placeholder="you@example.com"
          />
        </div>
        {message && (
          <p className={`text-sm ${success ? "text-green-700" : "text-red-600"}`}>{message}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm disabled:opacity-60"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
        >
          {submitting ? "Sending..." : "Send reset instructions"}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-primary hover:underline">
          Back to sign in
        </Link>
        <Link href={`/reset-password?next=${encodeURIComponent(next)}`} className="text-primary hover:underline">
          Have reset key?
        </Link>
      </div>
    </div>
  );
}
