import { validateChineseName, validateName } from "./name";
import type { FamilyMember } from "./chinese-data";
import { FAMILY_ROLES } from "./chinese-data";

export const NAME_STORAGE_KEY = "toddler-device-names-v2";
export function readDeviceNames(storage: Pick<Storage, "getItem">) {
  try {
    const data: unknown = JSON.parse(storage.getItem(NAME_STORAGE_KEY) ?? "{}");
    if (!data || typeof data !== "object") return { name: "", chineseName: "" };
    const record = data as Record<string, unknown>;
    const name = typeof record['name'] === "string" && !validateName(record['name']) ? record['name'] : "";
    const chineseName = typeof record['chineseName'] === "string" && !validateChineseName(record['chineseName']) ? record['chineseName'] : "";
    return { name, chineseName };
  } catch { return { name: "", chineseName: "" }; }
}
export function writeDeviceNames(storage: Pick<Storage, "setItem" | "removeItem">, name: string, chineseName: string) {
  if (!name && !chineseName) storage.removeItem(NAME_STORAGE_KEY);
  else storage.setItem(NAME_STORAGE_KEY, JSON.stringify({ name, chineseName }));
}
// Device-only IndexedDB: no fetch, upload, analytics, or cloud storage.
function familyDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("toddler-family-v2", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("family");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Device storage unavailable"));
  });
}
export async function readFamily(): Promise<FamilyMember[] | null> {
  const db = await familyDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("family", "readonly");
    const request = transaction.objectStore("family").get("members");
    request.onsuccess = () => {
      const value: unknown = request.result;
      resolve(Array.isArray(value) ? value.filter((m): m is FamilyMember => m && typeof m.id === "string" && FAMILY_ROLES.some(r => r.role === m.role) && (m.photo === undefined || (typeof m.photo === "string" && m.photo.startsWith("data:image/jpeg;base64,")))) : null);
    };
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => { db.close(); reject(new Error("Could not read family photos")); };
  });
}
export async function saveFamily(members: FamilyMember[]): Promise<void> {
  const db = await familyDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("family", "readwrite");
    transaction.objectStore("family").put(members, "members");
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(new Error("Could not save on this device")); };
  });
}
export async function resizeFamilyPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose a photo.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Please choose a photo smaller than 20 MB.");
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 512 / Math.max(image.width, image.height));
  canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext("2d");
  if (!context) { image.close(); throw new Error("Could not open this photo."); }
  context.drawImage(image, 0, 0, canvas.width, canvas.height); image.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}