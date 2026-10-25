export default function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "neon",
  level = 2,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  tone?: "neon" | "heat";
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className="max-w-3xl">
      <p
        className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] ${
          tone === "heat" ? "text-heat-text" : "text-neon-text"
        }`}
      >
        <span aria-hidden="true" className="font-display text-base italic tracking-normal">
          {"///"}
        </span>
        {eyebrow}
      </p>
      <Heading className="mt-3 font-display text-4xl font-extrabold uppercase italic leading-[1.1] text-heading sm:text-5xl">
        {title}
      </Heading>
      {lead && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{lead}</p>}
    </div>
  );
}
