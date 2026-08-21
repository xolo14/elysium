// Shared TanStack Start Vite config (includes React, Tailwind, tsconfig paths,
// nitro, and related plugins). Do not add those plugins again or they will duplicate.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
  vite: {
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
  },
});
