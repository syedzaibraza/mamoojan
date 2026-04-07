"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [key, setKey] = useState(searchParams.get("key") || "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, key, password }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Unable to reset password.");
      }
      toast.success(data.message || "Password reset successful.");
      router.push(`/login?next=${encodeURIComponent(next)}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to reset password.";
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>
        Reset password
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the reset key from your email and choose a new password.
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
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Reset key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm"
            placeholder="At least 8 characters"
          />
        </div>
        {message && <p className="text-sm text-red-600">{message}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm disabled:opacity-60"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
        >
          {submitting ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Remembered your password?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
