import { resolve } from "node:path";
import { access } from "node:fs/promises";
import type { Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { APP_MANIFEST, OFFLINE_SHELL, PRECACHE_GLOBS, isGameNavigation, isHashedAppAsset } from "./src/lib/pwa-policy";
import { readdir, readFile } from "node:fs/promises";

export function offlinePlugins() {
  let clientOutput = "";
  const plugins = VitePWA({
    strategies: "generateSW",
    filename: "sw.js",
    registerType: "autoUpdate",
    injectRegister: null,
    devOptions: { enabled: false },
    manifest: APP_MANIFEST,
    includeAssets: ["favicon.png", "icons/*.png"],
    workbox: {
      globPatterns: PRECACHE_GLOBS,
      globIgnores: ["**/sw.js", "**/workbox-*.js", "**/*.map"],
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      cleanupOutdatedCaches: true,
      additionalManifestEntries: [],
      skipWaiting: true,
      clientsClaim: true,
      // Navigations must try the network first; the static shell is a fallback only.
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: isGameNavigation,
          handler: "NetworkFirst",
          options: {
            cacheName: "toddler-pages",
            networkTimeoutSeconds: 4,
            precacheFallback: { fallbackURL: OFFLINE_SHELL },
            cacheableResponse: { statuses: [200] },
            expiration: { maxEntries: 30, maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: isHashedAppAsset,
          handler: "CacheFirst",
          options: {
            cacheName: "toddler-assets",
            cacheableResponse: { statuses: [200] },
            expiration: { maxEntries: 250, maxAgeSeconds: 365 * 24 * 60 * 60 },
          },
        },
      ],
    },
    integration: {
      async beforeBuildServiceWorker(options) {
        options.workbox.globDirectory = clientOutput;
        options.workbox.swDest = resolve(clientOutput, "sw.js");
        const directory = resolve("src/assets/flashcards");
        const files = await readdir(directory);
        options.workbox.additionalManifestEntries = await Promise.all(files.filter(file => file.endsWith(".asset.json")).map(async file => {
          const pointer = JSON.parse(await readFile(resolve(directory, file), "utf8"));
          return { url: pointer.url, revision: pointer.asset_id };
        }));
      },
    },
  });
  // Start creates its SPA shell in post-build, after closeBundle. Defer the
  // plugin's generateSW pass until then so the shell is in the precache.
  const buildPlugin = plugins.find((plugin) => plugin.name === "vite-plugin-pwa:build");
  if (buildPlugin) delete buildPlugin.closeBundle;
  const mainPlugin = plugins.find((plugin) => plugin.name === "vite-plugin-pwa");
  const finishOfflineBuild: Plugin = {
    name: "toddler:offline-after-prerender",
    apply: "build",
    enforce: "post",
    buildApp: {
      order: "post",
      async handler(builder) {
        const client = builder.environments['client'];
        if (!client) throw new Error("Offline build requires the client output");
        clientOutput = resolve(client.config.root, client.config.build.outDir);
        await access(resolve(clientOutput, OFFLINE_SHELL.slice(1)));
        if (!mainPlugin?.api) throw new Error("Offline plugin API unavailable");
        await mainPlugin.api.generateSW();
      },
    },
  };
  return [...plugins, finishOfflineBuild];
}