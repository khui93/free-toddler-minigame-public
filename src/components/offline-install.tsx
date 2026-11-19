import { useEffect, useState } from "react";
import { Check, Download, Share, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { subscribeOffline, type OfflineStatus } from "@/lib/pwa";

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function OfflineInstall() {
  const [status, setStatus] = useState<OfflineStatus>("preparing");
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  useEffect(() => {
    const unsubscribe = subscribeOffline(setStatus);
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const onPrompt = (event: Event) => { event.preventDefault(); setInstall(event as InstallEvent); };
    const onInstalled = () => { setInstalled(true); setInstall(null); setOpen(false); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      unsubscribe();
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  async function addToHome() {
    if (!install) { setOpen(true); return; }
    try {
      await install.prompt();
      const choice = await install.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setInstall(null);
    } catch { setOpen(true); }
  }
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-muted-foreground">
        <Button variant="ghost" className="h-auto min-h-9 whitespace-normal text-sm" onClick={() => installed ? setOpen(true) : void addToHome()}>
          {installed ? <WifiOff aria-hidden="true" /> : <Download aria-hidden="true" />}
          {installed ? "Play Offline" : "Play Offline / Add to Home Screen"}
        </Button>
        {status === "ready" && <span role="status" className="inline-flex items-center gap-1 text-xs"><Check className="size-3" />Ready for offline play</span>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Play Offline</DialogTitle>
            <DialogDescription>
              {status === "preview" ? "Offline play is available on the published game, not in this preview." : status === "ready" ? "All games and pictures are saved on this device. You can now play without internet." : status === "unavailable" ? "Offline download is unavailable. Open the published game in a regular browser and try again." : "Stay online while the games and pictures download. The menu will show when offline play is ready."}
            </DialogDescription>
          </DialogHeader>
          {!installed && <p className="text-sm text-muted-foreground">{ios ? <><Share className="mr-1 inline size-4" />In Safari, tap Share, then Add to Home Screen.</> : "In your browser’s menu, choose Install app or Add to Home Screen, if available."}</p>}
          <p className="text-xs text-muted-foreground">Names are never saved. Clearing browser data may remove the offline games.</p>
          {install && <Button onClick={() => void addToHome()}><Download />Add to Home Screen</Button>}
        </DialogContent>
      </Dialog>
    </>
  );
}