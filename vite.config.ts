// Shared TanStack Start Vite config (includes React, Tailwind, tsconfig paths,
// nitro, and related plugins). Do not add those plugins again or they will duplicate.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/** Hostinger shared hosting → static SPA */
const sharedHosting = process.env.HOSTINGER_SHARED === "1";

/**
 * Subdomain (elysiumhotel.grootdigitals.com) → base "/"
 * Subfolder (domain.com/elysium/) → set HOSTINGER_BASE=/elysium/
 */
const sharedBase = process.env.HOSTINGER_BASE || "/";

export default defineConfig({
  tanstackStart: sharedHosting
    ? {
        spa: {
          enabled: true,
        },
        prerender: {
          concurrency: 1,
        },
      }
    : {
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        server: { entry: "server" },
      },
  // Shared hosting has no Node runtime — skip Nitro. Node/VPS still uses node-server.
  nitro: sharedHosting ? false : { preset: "node-server" },
  vite: {
    base: sharedHosting ? sharedBase : "/",
    define: {
      "import.meta.env.VITE_STATIC_HOSTING": JSON.stringify(sharedHosting ? "true" : "false"),
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
  },
});
