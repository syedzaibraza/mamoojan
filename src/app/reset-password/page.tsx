"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [key, setKey] = useState(searchParams.get("key") || "");
  const [id] = useState(searchParams.get("id") || "");
  const [login] = useState(searchParams.get("login") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      if (!key || (!id && !login)) {
        throw new Error("Invalid reset link. Please request a new password reset email.");
      }

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, id, login, password }),
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
        Choose your new password.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-5 space-y-4">
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
        <div>
          <label className="text-sm text-muted-foreground">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
            className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm"
            placeholder="Repeat password"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-10 text-sm text-muted-foreground">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
