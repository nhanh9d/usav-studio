"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/content/dictionaries";
import { locales, type Locale } from "@/content/site";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // The path after the locale segment, e.g. "/tournaments" ("" on the landing page).
  const page = pathname.replace(/^\/[^/]+/, "").replace(/\/$/, "");

  const links = [
    { path: "", label: nav.home },
    { path: "/tournaments", label: nav.tournaments },
    { path: "/events", label: nav.events },
    { path: "/about", label: nav.about },
  ];
  const isCurrent = (path: string) => (path ? page === path || page.startsWith(`/`) : page === "");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={`/${lang}`} className="shrink-0" aria-label="USAV Studio">
          <Logo priority />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              href={`/${lang}${link.path}`}
              aria-current={isCurrent(link.path) ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-heading ${
                isCurrent(link.path) ? "text-neon-text" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex overflow-hidden rounded-sm border border-line text-xs font-semibold"
            role="group"
            aria-label={nav.switchLabel}
          >
            {locales.map((locale) => (
              <Link
                key={locale}
                href={`/${locale}${page}`}
                scroll={false}
                aria-current={locale === lang ? "true" : undefined}
                className={
                  locale === lang
                    ? "bg-neon px-2.5 py-1.5 uppercase text-on-accent"
                    : "px-2.5 py-1.5 uppercase text-muted transition-colors hover:text-heading"
                }
              >
                {locale}
              </Link>
            ))}
          </div>

          <ThemeToggle label={nav.theme} />

          <a
            href="#contact"
            className="clip-slant hidden bg-neon px-5 py-2 font-display text-base font-bold uppercase tracking-wide text-on-accent transition-[filter] hover:brightness-110 sm:block"
          >
            {nav.cta}
          </a>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-sm border border-line lg:hidden"
            aria-label={nav.menu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-ink px-4 py-3 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.path}
              href={`/${lang}${link.path}`}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(link.path) ? "page" : undefined}
              className={`block py-2.5 font-display text-xl font-bold uppercase tracking-wide ${
                isCurrent(link.path) ? "text-neon-text" : "text-body"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
