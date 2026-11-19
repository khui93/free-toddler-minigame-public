import { isAppWorker, refuseAppWorker } from "./pwa-policy";

export type OfflineStatus = "preparing" | "ready" | "unavailable" | "preview";
let status: OfflineStatus = "preparing";
const listeners = new Set<(value: OfflineStatus) => void>();
export function subscribeOffline(listener: (value: OfflineStatus) => void) {
  listeners.add(listener);
  listener(status);
  return () => { listeners.delete(listener); };
}
function notify(next: OfflineStatus) {
  status = next;
  listeners.forEach((listener) => listener(next));
}

export function startOfflineSupport() {
  let disposed = false;
  let registration: ServiceWorkerRegistration | undefined;
  const checkUpdate = () => {
    if (navigator.onLine && registration) void registration.update().catch(() => {});
  };
  async function setup() {
    if (!("serviceWorker" in navigator)) { notify("unavailable"); return; }
    const refused = refuseAppWorker({
      production: import.meta.env.PROD,
      framed: window.self !== window.top,
      hostname: window.location.hostname,
      search: window.location.search,
    });
    if (refused) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.filter((item) =>
        [item.active, item.waiting, item.installing].some((worker) =>
          worker && isAppWorker(worker.scriptURL, window.location.origin),
        ),
      ).map((item) => item.unregister()));
      notify("preview");
      return;
    }
    if (disposed) return;
    const { registerSW } = await import("virtual:pwa-register");
    if (disposed) return;
    registerSW({
      immediate: true,
      onOfflineReady: () => notify("ready"),
      // Auto-update the cached files without refreshing away a child's game/name.
      onNeedReload: () => {},
      onRegisteredSW: (_url, registered) => {
        registration = registered;
        if (disposed) return;
        if (registered?.active && !registered.installing) notify("ready");
        checkUpdate();
      },
      onRegisterError: () => notify("unavailable"),
    });
  }
  void setup().catch(() => notify("unavailable"));
  window.addEventListener("online", checkUpdate);
  const onVisible = () => { if (document.visibilityState === "visible") checkUpdate(); };
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    disposed = true;
    window.removeEventListener("online", checkUpdate);
    document.removeEventListener("visibilitychange", onVisible);
  };
}