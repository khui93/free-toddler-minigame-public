// Only public app files are cached. Device-only names/photos are never cached by the worker.
export const APP_MANIFEST = {
  id: "/",
  name: "Toddler Mini Games",
  short_name: "Toddler Games",
  description: "Silent tap-and-play learning games for little kids.",
  start_url: "/menu",
  scope: "/",
  display: "standalone" as const,
  background_color: "oklch(0.97 0.03 85)",
  theme_color: "oklch(0.65 0.12 190)",
  icons: [
    { src: "/icons/app-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icons/app-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
  ],
};

export function refuseAppWorker({ production, framed, hostname, search }: {
  production: boolean; framed: boolean; hostname: string; search: string;
}) {
  return !production || framed || new URLSearchParams(search).get("sw") === "off"
    || hostname.startsWith("id-preview--") || hostname.startsWith("preview--")
    || ["lovableproject.com", "lovableproject-dev.com", "beta.lovable.dev"].some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
}

export function isAppWorker(scriptURL: string, origin: string) {
  const url = new URL(scriptURL, origin);
  return url.origin === origin && url.pathname === "/sw.js";
}

export const OFFLINE_SHELL = "/offline/index.html";
export const PRECACHE_GLOBS = ["**/*.{js,css,html,png,jpg,jpeg,svg,webp,gif,woff,woff2,ico,webmanifest}"];

export function isGameNavigation({ request, url }: { request: { mode: string }; url: URL }) {
  return request.mode === "navigate" && !/^\/(?:~oauth|api)(?:\/|$)/.test(url.pathname);
}

export function isHashedAppAsset({ url, sameOrigin }: { url: URL; sameOrigin: boolean }) {
  return sameOrigin && /^\/assets\/[^/]+-[\w-]{8,}\.[\w]+$/.test(url.pathname);
}