import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL — 4B’s now expands in place on the homepage. */
export const Route = createFileRoute("/why")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "why" });
  },
});
