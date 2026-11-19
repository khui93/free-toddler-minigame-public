import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { readDeviceNames, writeDeviceNames } from "./device-data";

// Device only: browser storage is read after hydration, never sent anywhere.
const Ctx = createContext<{ name: string; setName: (n: string) => void; chineseName: string; setChineseName: (n: string) => void; storageError: boolean; clearNames: () => void } | null>(null);

export function ChildNameProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [chineseName, setChineseName] = useState("");
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { const data = readDeviceNames(localStorage); setName(data.name); setChineseName(data.chineseName); }
    catch { setStorageError(true); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { writeDeviceNames(localStorage, name, chineseName); setStorageError(false); }
    catch { setStorageError(true); }
  }, [name, chineseName, ready]);
  return <Ctx.Provider value={{ name, setName, chineseName, setChineseName, storageError, clearNames: () => { setName(""); setChineseName(""); } }}>{children}</Ctx.Provider>;
}

export function useChildName() {
  const v = useContext(Ctx);
  if (!v) throw new Error("ChildNameProvider missing");
  return v;
}
