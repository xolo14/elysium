import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { adminLogin, getAdminSession } from "@/fns/admin";

const isStatic = import.meta.env.VITE_STATIC_HOSTING === "true";
const deskUrl = `${import.meta.env.BASE_URL || "/"}desk/`.replace(/([^:]\/)\/+/g, "$1");

export const Route = createFileRoute("/admin/login")({
  loader: async () => {
    if (isStatic) {
      throw redirect({ href: deskUrl, reloadDocument: true });
    }
    const session = await getAdminSession();
    if (session.authenticated) {
      throw redirect({ to: "/admin" });
    }
    return null;
  },
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isStatic) {
      window.location.replace(deskUrl);
    }
  }, []);

  if (isStatic) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-forest px-5 text-ivory">
        <p className="text-sm">
          Redirecting to desk admin…{" "}
          <a className="underline" href={deskUrl}>
            Open /desk/
          </a>
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminLogin({ data: { password } });
      await router.navigate({ to: "/admin" });
    } catch {
      setError("Invalid password. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-forest px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-ivory/20 bg-background p-8 sm:p-10"
      >
        <p className="eyebrow text-muted-foreground">Elysium Admin</p>
        <h1 className="mt-3 font-display text-3xl">Sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Manage reservations, check-ins, and stay history.
        </p>

        <label className="mt-8 block">
          <span className="eyebrow text-muted-foreground">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm focus:border-foreground focus:outline-none"
          />
        </label>

        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full bg-forest px-6 py-4 text-ivory transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <span className="eyebrow">{submitting ? "Signing in…" : "Sign in"}</span>
        </button>
      </form>
    </div>
  );
}
