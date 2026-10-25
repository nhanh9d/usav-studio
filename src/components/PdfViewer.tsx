"use client";

import dynamic from "next/dynamic";
import type { PdfLabels } from "./PdfDocument";

// pdf.js needs browser APIs at import time, so the viewer is loaded on the client only.
const PdfDocument = dynamic(() => import("./PdfDocument"), { ssr: false });

export default function PdfViewer(props: { file: string; labels: PdfLabels }) {
  return <PdfDocument {...props} />;
}
