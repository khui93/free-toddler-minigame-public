import { describe, expect, it } from "vitest";
import { APP_MANIFEST, OFFLINE_SHELL, PRECACHE_GLOBS, refuseAppWorker, isAppWorker, isGameNavigation, isHashedAppAsset } from "@/lib/pwa-policy";

const publicContext = { production: true, framed: false, hostname: "free-toddler-minigame.lovable.app", search: "" };
describe("Offline app rules", () => {
  it("uses Toddler Mini Games, standalone display, and both requested icon sizes", () => {
    expect(APP_MANIFEST.name).toBe("Toddler Mini Games");
    expect(APP_MANIFEST.display).toBe("standalone");
    expect(APP_MANIFEST.icons.map((icon) => icon.sizes)).toEqual(["192x192", "512x512"]);
    expect(APP_MANIFEST.start_url).toBe("/menu");
  });
  it("allows registration only in published top-level production contexts", () => {
    expect(refuseAppWorker(publicContext)).toBe(false);
    expect(refuseAppWorker({ ...publicContext, production: false })).toBe(true);
    expect(refuseAppWorker({ ...publicContext, framed: true })).toBe(true);
    expect(refuseAppWorker({ ...publicContext, search: "?sw=off" })).toBe(true);
  });
  it.each(["id-preview--abc.lovable.app", "preview--abc.lovable.app", "lovableproject.com", "a.lovableproject.com", "lovableproject-dev.com", "a.lovableproject-dev.com", "beta.lovable.dev", "a.beta.lovable.dev"])("blocks preview hostname %s", (hostname) => {
    expect(refuseAppWorker({ ...publicContext, hostname })).toBe(true);
  });
  it("cleanup only targets this origin's app worker, never messaging workers", () => {
    const origin = "https://free-toddler-minigame.lovable.app";
    expect(isAppWorker(`${origin}/sw.js`, origin)).toBe(true);
    expect(isAppWorker(`${origin}/firebase-messaging-sw.js`, origin)).toBe(false);
    expect(isAppWorker("https://example.com/sw.js", origin)).toBe(false);
  });
  it("uses an offline shell and includes chunks, HTML, toy PNGs, and local fonts", () => {
    expect(OFFLINE_SHELL).toBe("/offline/index.html");
    for (const extension of ["js", "html", "png", "woff2"]) expect(PRECACHE_GLOBS[0]).toContain(extension);
  });
  it("excludes OAuth and API requests from navigation caching", () => {
    const check = (path: string, mode = "navigate") => isGameNavigation({ request: { mode }, url: new URL(path, "https://example.com") });
    expect(check("/games/sort-toys")).toBe(true);
    expect(check("/~oauth/callback")).toBe(false);
    expect(check("/api/public/test")).toBe(false);
    expect(check("/menu", "cors")).toBe(false);
  });
  it("restricts runtime CacheFirst assets to same-origin hashed filenames", () => {
    const url = new URL("https://example.com/assets/bunny-AbCd1234.png");
    expect(isHashedAppAsset({ url, sameOrigin: true })).toBe(true);
    expect(isHashedAppAsset({ url, sameOrigin: false })).toBe(false);
    expect(isHashedAppAsset({ url: new URL("https://example.com/menu"), sameOrigin: true })).toBe(false);
  });
});