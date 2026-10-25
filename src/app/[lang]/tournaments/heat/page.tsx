import ScrollNav from "@/components/ScrollNav";
import { Contact, Heat, HeatHero, HeatResults, Rulebook } from "@/components/sections";
import { loadPage, type PageProps } from "@/content/page";
import { hasHeatRulebook } from "@/content/rulebook";
import { heat } from "@/content/site";

export async function generateMetadata(props: PageProps) {
  const { t } = await loadPage(props);
  return { title: `${heat.name} ${heat.edition}`, description: t.heat.lead };
}

export default async function HeatDetail(props: PageProps) {
  const { t, lang } = await loadPage(props);

  return (
    <>
      <ScrollNav
        sections={[
          { id: "overview", label: heat.edition },
          { id: "results", label: t.results.eyebrow },
          { id: "heat", label: t.heat.infoTitle },
          { id: "rulebook", label: t.rulebook.eyebrow },
          { id: "contact", label: t.nav.contact },
        ]}
      />
      <main id="top">
        <HeatHero t={t} lang={lang} />
        <HeatResults t={t} />
        <Heat t={t} />
        <Rulebook t={t} available={hasHeatRulebook()} />
        <Contact t={t} />
      </main>
    </>
  );
}
