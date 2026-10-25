"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

function storedTheme() {
  try {
    const theme = localStorage.getItem("theme");
    return theme === "light" || theme === "dark" ? theme : null;
  } catch {
    // Storage can be unavailable (private mode).
    return null;
  }
}

// The active theme lives on <html data-theme>, set before paint by the script in the root layout,
// so this button keeps no React state and the icons are swapped with CSS.
export default function ThemeToggle({ label }: { label: string }) {
  const pathname = usePathname();

  // Switching language re-renders <html>, which drops the attribute; put it back before paint.
  useLayoutEffect(() => {
    const theme = storedTheme();
    if (theme) document.documentElement.dataset.theme = theme;
  }, [pathname]);

  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // The theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex size-9 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:text-heading"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[18px] light:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="hidden size-[18px] light:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
      </svg>
    </button>
  );
}
