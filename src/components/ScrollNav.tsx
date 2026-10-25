"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useActiveSection } from "./useActiveSection";

// Blocks inside each section (everything after the hero) slide in as they scroll into view.
const REVEAL_SELECTOR = "main > section:not(:first-of-type) .max-w-6xl > *";

// Must match the `fp` variant and the full-page media query in globals.css.
const FULL_PAGE_QUERY = "(min-width: 1024px) and (min-height: 640px)";
// How long further wheel and key input is ignored after a jump starts.
const JUMP_LOCK_MS = 900;

export default function ScrollNav({ sections }: { sections: { id: string; label: string }[] }) {
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  const active = useActiveSection(sections.map((item) => item.id));

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Full-page mode: one wheel gesture or key press moves exactly one section.
  useEffect(() => {
    const fullPage = window.matchMedia(FULL_PAGE_QUERY);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lockedUntil = 0;

    const panels = () => Array.from(document.querySelectorAll<HTMLElement>("main > section"));

    // Returns true when the jump was handled, false when native scrolling should take over.
    // `distance` is how far the browser would scroll natively for this input.
    const step = (direction: 1 | -1, distance: number) => {
      const list = panels();
      // The current panel is the last one whose top edge has reached the top of the viewport.
      let index = 0;
      list.forEach((panel, i) => {
        if (panel.getBoundingClientRect().top <= 2) index = i;
      });
      const rect = list[index].getBoundingClientRect();
      // How much of the current panel is still hidden in the scroll direction.
      const hidden = direction === 1 ? rect.bottom - window.innerHeight : -rect.top;
      if (hidden > 2) {
        // A panel taller than the screen (the results, a short laptop, zoomed text) scrolls normally while there
        // is more of it to see, as long as this scroll would not run past its edge.
        const tall = rect.height > window.innerHeight + 2;
        if (tall && hidden > distance) return false;
        // Otherwise line up on a panel edge: the next panel going down, the top of this panel going up.
        // Snapping up to this panel's own top also re-aligns the page after native scrolling or the footer.
        if (direction === -1) {
          goTo(list[index]);
          return true;
        }
      }
      const target = list[index + direction];
      if (!target) return false;
      // Coming back up into a panel taller than the screen lands on its bottom, so none of it is skipped.
      goTo(target, direction === -1 && target.getBoundingClientRect().height > window.innerHeight + 2);
      return true;
    };

    const goTo = (target: HTMLElement, alignBottom = false) => {
      lockedUntil = performance.now() + JUMP_LOCK_MS;
      const rect = target.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + (alignBottom ? rect.bottom - window.innerHeight : rect.top),
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (!fullPage.matches || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      // Areas with their own scrolling (the rulebook viewer) keep the wheel to themselves.
      if ((event.target as Element | null)?.closest?.("[data-own-scroll]")) return;
      // Swallow the rest of the gesture (trackpad inertia) while a jump is in progress.
      if (performance.now() < lockedUntil) {
        event.preventDefault();
        return;
      }
      // deltaMode 1 is lines (Firefox); treat a line as 40px.
      const distance = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 40 : 1);
      if (step(event.deltaY > 0 ? 1 : -1, distance)) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!fullPage.matches || event.ctrlKey || event.metaKey || event.altKey) return;
      const element = event.target as HTMLElement | null;
      if (element?.closest("input, textarea, select, [contenteditable], [data-own-scroll]")) return;
      const onControl = Boolean(element?.closest("a, button"));

      // Roughly how far the browser itself scrolls for an arrow key versus a page key or space.
      const distance = event.key.startsWith("Arrow") ? 40 : window.innerHeight * 0.85;
      let handled = false;
      if (event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey && !onControl)) {
        handled = performance.now() < lockedUntil || step(1, distance);
      } else if (event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey && !onControl)) {
        handled = performance.now() < lockedUntil || step(-1, distance);
      } else if (event.key === "Home") {
        goTo(panels()[0]);
        handled = true;
      } else if (event.key === "End") {
        const list = panels();
        goTo(list[list.length - 1]);
        handled = true;
      }
      if (handled) event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("reveal-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    // Only blocks still below the fold are hidden, so nothing already on screen flickers.
    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
      if (element.classList.contains("reveal-in")) return;
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      const index = Array.prototype.indexOf.call(element.parentElement?.children ?? [], element);
      element.style.transitionDelay = `${Math.min(index, 3) * 90}ms`;
      element.classList.add("reveal");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <div
        ref={progress}
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-neon"
      />

      <nav
        aria-label="Sections"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        <ul className="flex flex-col items-end gap-3">
          {sections.map((item, index) => {
            const current = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "true" : undefined}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={`font-display text-sm font-bold uppercase tracking-wide transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${
                      current ? "translate-x-0 text-heading opacity-100" : "translate-x-2 text-muted opacity-0"
                    }`}
                  >
                    <span className="mr-2 italic text-neon-text">{String(index + 1).padStart(2, "0")}</span>
                    {item.label}
                  </span>
                  <span
                    className={`block h-0.5 transition-all duration-300 ${
                      current ? "w-8 bg-neon" : "w-4 bg-muted/50 group-hover:w-6 group-hover:bg-muted"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
