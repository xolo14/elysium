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

/** Public marketing routes to prerender as full HTML (avoids empty-shell hydration #418). */
const staticPages = [
  "/",
  "/about",
  "/why",
  "/book",
  "/privacy",
  "/terms",
  "/hotels/madhapur",
  "/hotels/hitec-city",
  "/hotels/madhapur/gallery",
  "/hotels/hitec-city/gallery",
];

export default defineConfig({
  tanstackStart: sharedHosting
    ? {
        // Full static prerender — do NOT use spa.maskPath "/" (that wrote an empty
        // shell over index.html and triggered React hydration error #418 live).
        spa: {
          enabled: false,
        },
        pages: staticPages.map((path) => ({
          path,
          prerender: { enabled: true, crawlLinks: path === "/" },
        })),
        prerender: {
          enabled: true,
          concurrency: 1,
          crawlLinks: true,
          failOnError: false,
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
    build: {
      cssCodeSplit: true,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/motion")) return "motion";
            if (id.includes("node_modules/@tanstack")) return "tanstack";
            if (id.includes("node_modules/lucide-react")) return "icons";
            return undefined;
          },
        },
      },
    },
  },
});
