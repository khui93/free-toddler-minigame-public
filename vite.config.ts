// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { offlinePlugins } from "./pwa.config";

export default defineConfig({
  plugins: offlinePlugins(),
  tanstackStart: {
    // A client-only shell avoids persisting random round markup or child data.
    spa: { enabled: true, maskPath: "/", prerender: { outputPath: "/offline/index.html" } },
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
    pages: [],
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
