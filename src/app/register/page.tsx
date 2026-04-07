"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Unable to create account.");
      }
      toast.success("Account created successfully.");
      router.push(next);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to create account.";
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>
        Create account
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Register to view orders, manage profile details, and more.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm"
            />
          </div>
        </div>
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
        <div>
          <label className="text-sm text-muted-foreground">Password</label>
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
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-10 text-sm text-muted-foreground">Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
