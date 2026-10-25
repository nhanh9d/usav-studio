import ScrollNav from "@/components/ScrollNav";
import { Contact, Hero, Services, Ticker, Upcoming } from "@/components/sections";
import { loadPage, type PageProps } from "@/content/page";

export default async function Home(props: PageProps) {
  const { lang, t } = await loadPage(props);

  return (
    <>
      <ScrollNav
        sections={[
          { id: "intro", label: "USAV Studio" },
          { id: "upcoming", label: t.nav.upcoming },
          { id: "services", label: t.nav.services },
          { id: "contact", label: t.nav.contact },
        ]}
      />
      <main id="top">
        <Hero t={t} lang={lang} />
        <Ticker t={t} />
        <Upcoming t={t} lang={lang} />
        <Services t={t} lang={lang} />
        <Contact t={t} />
      </main>
    </>
  );
}
