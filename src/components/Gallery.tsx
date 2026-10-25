"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

export type GalleryLabels = { open: string; close: string; previous: string; next: string };

const SWIPE_DISTANCE = 40;
const control =
  "flex size-11 items-center justify-center rounded-sm border border-white/25 bg-black/50 text-white transition-colors hover:bg-black/80";

// Thumbnail grid; clicking a photo opens it in a full-screen carousel.
export default function Gallery({
  images,
  labels,
}: {
  images: { image: StaticImageData; alt: string }[];
  labels: GalleryLabels;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const move = (step: number) =>
    setIndex((value) => (value === null ? value : (value + step + images.length) % images.length));

  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    // Keep the page behind the carousel from scrolling.
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      // Hand keyboard focus back to the photo that was opened.
      opener.current?.focus();
    };
  }, [open]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3">
        {images.map((item, position) => (
          <li key={item.image.src}>
            <button
              type="button"
              onClick={(event) => {
                opener.current = event.currentTarget;
                setIndex(position);
              }}
              aria-label={`${labels.open}: ${item.alt}`}
              className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden border border-line"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 18rem, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {open && (
        // `data-own-scroll` keeps ScrollNav from jumping sections on arrow keys or wheel while open.
        <dialog
          ref={dialog}
          data-own-scroll
          aria-label={images[index].alt}
          // Fired when the browser closes the dialog itself (Escape key).
          onClose={() => setIndex(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIndex(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") move(1);
            if (event.key === "ArrowLeft") move(-1);
          }}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStart.current;
            touchStart.current = null;
            if (Math.abs(distance) > SWIPE_DISTANCE) move(distance < 0 ? 1 : -1);
          }}
          className="fixed inset-0 m-0 size-full max-h-none max-w-none bg-black/90 p-0 backdrop:bg-black/60"
        >
          <div className="pointer-events-none flex size-full flex-col items-center justify-center gap-4 p-4 sm:px-20">
            <Image
              key={images[index].image.src}
              src={images[index].image}
              alt={images[index].alt}
              placeholder="blur"
              sizes="100vw"
              className="pointer-events-auto h-auto max-h-[78dvh] w-auto max-w-full object-contain"
            />
            <p className="pointer-events-auto text-center text-sm text-white/85">
              <span className="mr-3 font-display text-base font-bold italic text-neon">
                {index + 1} / {images.length}
              </span>
              {images[index].alt}
            </p>
            <div className="pointer-events-auto flex gap-2">
              {images.map((item, position) => (
                <button
                  key={item.image.src}
                  type="button"
                  onClick={() => setIndex(position)}
                  aria-label={`${position + 1} / ${images.length}`}
                  aria-current={position === index ? "true" : undefined}
                  className={`h-1.5 transition-all ${position === index ? "w-8 bg-neon" : "w-4 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </div>

          <button type="button" onClick={() => setIndex(null)} aria-label={labels.close} className={`${control} absolute right-4 top-4`}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={labels.previous}
            className={`${control} absolute left-4 top-1/2 -translate-y-1/2`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={labels.next}
            className={`${control} absolute right-4 top-1/2 -translate-y-1/2`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </dialog>
      )}
    </>
  );
}
