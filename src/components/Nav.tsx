"use client";

import Link from "next/link";
import { useState } from "react";
import CommandPalette from "./CommandPalette";
import { GitHubIcon } from "./icons";
import { ThemeCycleButton, ThemeSegmented } from "./ThemeToggle";

const LINKS = [
  { href: "/#skills", label: "Skills" },
  { href: "/#products", label: "Products" },
  { href: "/#music", label: "Music" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <div className="nav__left">
          <Link className="wordmark" href="/">
            0266st / 0168th
          </Link>
          <nav className="nav__links" aria-label="主要ナビゲーション">
            {LINKS.map((link) => (
              <Link key={link.href} className="nav__link" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="nav__right">
          <CommandPalette />
          <ThemeCycleButton />
          <a
            className="btn btn--cta"
            href="https://github.com/0266st"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon className="btn__icon" />
            <span className="btn__label">GitHub</span>
            <span className="btn__ext" aria-hidden="true">↗</span>
            <span className="sr-only">(新しいタブで開く)</span>
          </a>
          <button
            type="button"
            className="nav__menu-btn"
            aria-label="メニューを開く"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="container nav__mobile" aria-label="モバイルナビゲーション">
          {LINKS.map((link) => (
            <Link key={link.href} className="nav__link" href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <ThemeSegmented />
        </nav>
      )}
    </header>
  );
}
