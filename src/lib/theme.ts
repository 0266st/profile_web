import { useSyncExternalStore } from "react";
import { DARK_QUERY, THEME_STORAGE_KEY as KEY } from "./theme-script";

export type ThemePref = "system" | "light" | "dark";

export const THEME_LABEL: Record<ThemePref, string> = {
  system: "OSに合わせる",
  light: "ライト",
  dark: "ダーク",
};

function readPref(): ThemePref {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function applyTheme(pref: ThemePref) {
  const resolved = pref === "system" ? (matchMedia(DARK_QUERY).matches ? "dark" : "light") : pref;
  document.documentElement.setAttribute("data-theme", resolved);
}

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const media = matchMedia(DARK_QUERY);
  const onSystemChange = () => {
    if (readPref() === "system") applyTheme("system");
  };
  // Another tab changed the setting.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY && e.key !== null) return;
    applyTheme(readPref());
    onChange();
  };
  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function setThemePref(pref: ThemePref) {
  try {
    if (pref === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    // Storage blocked (private mode etc.): still switch for this page view.
  }
  applyTheme(pref);
  listeners.forEach((listener) => listener());
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(subscribe, readPref, () => "system");
}
