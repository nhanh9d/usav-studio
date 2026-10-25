import ScrollNav from "@/components/ScrollNav";
import { Contact, EventInvite, PastEvent } from "@/components/sections";
import { loadPage, type PageProps } from "@/content/page";
import { event } from "@/content/site";

export async function generateMetadata(props: PageProps) {
  const { t } = await loadPage(props);
  return { title: t.nav.events, description: t.event.lead };
}

export default async function Events(props: PageProps) {
  const { t } = await loadPage(props);

  return (
    <>
      <ScrollNav
        sections={[
          { id: "event", label: event.name },
          { id: "past-events", label: t.pastEvent.eyebrow },
          { id: "contact", label: t.nav.contact },
        ]}
      />
      <main id="top">
        <EventInvite t={t} level={1} />
        <PastEvent t={t} />
        <Contact t={t} />
      </main>
    </>
  );
}
