"use client";

import { THEME_LABEL, setThemePref, useThemePref, type ThemePref } from "@/lib/theme";

const ORDER: ThemePref[] = ["system", "light", "dark"];

function ThemeIcon({ pref }: { pref: ThemePref }) {
  if (pref === "light") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        <path
          d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (pref === "dark") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path fill="currentColor" d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6v2h3a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h3v-2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v10h16V5H4Z"
      />
    </svg>
  );
}

/** Header control: one button that cycles OS → ライト → ダーク. */
export function ThemeCycleButton() {
  const pref = useThemePref();
  const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
  const label = `テーマ: ${THEME_LABEL[pref]}(押すと${THEME_LABEL[next]})`;
  return (
    <button
      type="button"
      className="theme-btn nav__theme"
      onClick={() => setThemePref(next)}
      aria-label={label}
      title={label}
    >
      <ThemeIcon pref={pref} />
    </button>
  );
}

/** Mobile menu control: all three options visible at once. */
export function ThemeSegmented() {
  const pref = useThemePref();
  return (
    <div className="theme-seg" role="group" aria-label="テーマ">
      {ORDER.map((option) => (
        <button
          key={option}
          type="button"
          className="theme-seg__opt"
          aria-pressed={pref === option}
          aria-label={THEME_LABEL[option]}
          onClick={() => setThemePref(option)}
        >
          <ThemeIcon pref={option} />
          {option === "system" ? "OS" : THEME_LABEL[option]}
        </button>
      ))}
    </div>
  );
}
