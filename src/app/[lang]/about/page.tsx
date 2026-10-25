import ScrollNav from "@/components/ScrollNav";
import { AboutIntro, Contact, Strengths, Team } from "@/components/sections";
import { loadPage, type PageProps } from "@/content/page";

export async function generateMetadata(props: PageProps) {
  const { t } = await loadPage(props);
  return { title: t.nav.about, description: t.about.lead };
}

export default async function About(props: PageProps) {
  const { t } = await loadPage(props);

  return (
    <>
      <ScrollNav
        sections={[
          { id: "about", label: t.nav.about },
          { id: "strengths", label: t.nav.strengths },
          { id: "team", label: t.nav.team },
          { id: "contact", label: t.nav.contact },
        ]}
      />
      <main id="top">
        <AboutIntro t={t} />
        <Strengths t={t} />
        <Team t={t} />
        <Contact t={t} />
      </main>
    </>
  );
}
