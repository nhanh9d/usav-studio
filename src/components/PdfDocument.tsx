"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";

// Must be set in the same module that renders <Document> (see the react-pdf README).
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export type PdfLabels = {
  viewer: string;
  page: string;
  zoomIn: string;
  zoomOut: string;
  open: string;
  loading: string;
  error: string;
};

const MAX_FIT_WIDTH = 880;
const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const toolButton =
  "flex size-9 items-center justify-center rounded-sm border border-line text-body transition-colors hover:text-heading disabled:opacity-40";

export default function PdfDocument({ file, labels }: { file: string; labels: PdfLabels }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  // Height / width of a page, used to size placeholders for pages that are not rendered yet.
  const [ratio, setRatio] = useState(Math.SQRT2);
  const [fitWidth, setFitWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [current, setCurrent] = useState(1);
  // Only pages near the visible area get a canvas, so long documents stay light on phones.
  const [near, setNear] = useState<Set<number>>(() => new Set([1, 2]));

  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const measure = () => setFitWidth(Math.min(element.clientWidth - 32, MAX_FIT_WIDTH));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = scroller.current;
    if (!element || !numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setNear((previous) => {
          const next = new Set(previous);
          for (const entry of entries) {
            const page = Number((entry.target as HTMLElement).dataset.page);
            if (entry.isIntersecting) next.add(page);
            else next.delete(page);
          }
          return next;
        });
      },
      { root: element, rootMargin: "100% 0px" },
    );
    const pages = Array.from(element.querySelectorAll<HTMLElement>("[data-page]"));
    pages.forEach((page) => observer.observe(page));

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = element.scrollTop + element.clientHeight / 3;
      let page = 1;
      for (const item of pages) {
        if (item.offsetTop <= line) page = Number(item.dataset.page);
      }
      setCurrent(page);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    element.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.removeEventListener("scroll", onScroll);
    };
  }, [numPages]);

  const width = Math.round(fitWidth * zoom);
  const zoomIndex = ZOOM_STEPS.indexOf(zoom);
  const message = "flex h-full min-h-60 items-center justify-center px-6 text-center text-sm text-muted";

  return (
    <div className="flex h-full flex-col border border-line bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <p className="text-sm font-semibold text-heading" aria-live="polite">
          <span className="font-normal text-muted">{labels.page} </span>
          {numPages ? `${current} / ${numPages}` : "–"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={toolButton}
            aria-label={labels.zoomOut}
            disabled={zoomIndex <= 0}
            onClick={() => setZoom(ZOOM_STEPS[zoomIndex - 1])}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className="w-12 text-center text-sm tabular-nums text-body">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className={toolButton}
            aria-label={labels.zoomIn}
            disabled={zoomIndex >= ZOOM_STEPS.length - 1}
            onClick={() => setZoom(ZOOM_STEPS[zoomIndex + 1])}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5v14" />
            </svg>
          </button>
          <a href={file} target="_blank" rel="noopener noreferrer" className={toolButton} aria-label={labels.open} title={labels.open}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
            </svg>
          </a>
        </div>
      </div>

      {/* `data-own-scroll` tells ScrollNav to leave wheel and key input in here alone. */}
      <div
        ref={scroller}
        data-own-scroll
        tabIndex={0}
        role="region"
        aria-label={labels.viewer}
        className="relative min-h-0 flex-1 overflow-auto overscroll-contain bg-ink"
      >
        {fitWidth > 0 && (
          <Document
            file={file}
            suspense={false}
            loading={<p className={message}>{labels.loading}</p>}
            error={<p className={message}>{labels.error}</p>}
            noData={<p className={message}>{labels.error}</p>}
            onLoadSuccess={async (pdf) => {
              setNumPages(pdf.numPages);
              const first = await pdf.getPage(1);
              const viewport = first.getViewport({ scale: 1 });
              setRatio(viewport.height / viewport.width);
            }}
            className="mx-auto flex w-max min-w-full flex-col items-center gap-4 p-4"
          >
            {Array.from({ length: numPages }, (_, index) => index + 1).map((page) => (
              <div
                key={page}
                data-page={page}
                className="bg-white shadow-lg shadow-black/30"
                style={{ width, minHeight: Math.round(width * ratio) }}
              >
                {near.has(page) && (
                  <Page
                    pageNumber={page}
                    width={width}
                    devicePixelRatio={Math.min(2, window.devicePixelRatio || 1)}
                    renderAnnotationLayer={false}
                    loading=""
                  />
                )}
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
