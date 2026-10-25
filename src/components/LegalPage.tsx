import SectionHeading from "@/components/SectionHeading";
import type { LegalDocument } from "@/content/legal";

// Long-form legal text; a plain reading column rather than the full-screen `.panel` sections.
export default function LegalPage({ doc, eyebrow, updated }: { doc: LegalDocument; eyebrow: string; updated: string }) {
  return (
    <main id="top" className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 sm:pb-28">
      <SectionHeading level={1} eyebrow={eyebrow} title={doc.title} />
      <p className="mt-4 text-sm text-muted">{updated}</p>
      <p className="mt-8 leading-relaxed text-body">{doc.intro}</p>

      {doc.sections.map((section) => (
        <section key={section.heading} className="mt-10 border-t border-line pt-8">
          <h2 className="font-display text-2xl font-bold uppercase italic text-heading">{section.heading}</h2>
          {section.items && (
            <ul className="mt-4 space-y-3">
              {section.items.map((item) => (
                <li key={item} className="flex gap-4 leading-relaxed text-body">
                  <span aria-hidden="true" className="mt-3 h-0.5 w-4 shrink-0 bg-neon" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-4 leading-relaxed text-body">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
