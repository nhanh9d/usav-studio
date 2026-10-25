import ScrollNav from "@/components/ScrollNav";
import { Contact, ContentStudy, Projects, TournamentsHero } from "@/components/sections";
import { loadPage, type PageProps } from "@/content/page";

export async function generateMetadata(props: PageProps) {
  const { t } = await loadPage(props);
  return { title: t.nav.tournaments, description: t.tournaments.lead };
}

export default async function Tournaments(props: PageProps) {
  const { t, lang } = await loadPage(props);

  return (
    <>
      <ScrollNav
        sections={[
          { id: "overview", label: t.tournaments.eyebrow },
          { id: "projects", label: t.nav.projects },
          { id: "content", label: t.nav.content },
          { id: "contact", label: t.nav.contact },
        ]}
      />
      <main id="top">
        <TournamentsHero t={t} lang={lang} />
        <Projects t={t} />
        <ContentStudy t={t} />
        <Contact t={t} />
      </main>
    </>
  );
}
