import { notFound } from "next/navigation";
import { getDictionary } from "./dictionaries";
import { isLocale } from "./site";

export type PageProps = { params: Promise<{ lang: string }> };

// Resolves the locale and its dictionary for a page under /[lang].
export async function loadPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { lang, t: getDictionary(lang) };
}
