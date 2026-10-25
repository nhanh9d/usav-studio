import LegalPage from "@/components/LegalPage";
import { getLegal, legalUpdated } from "@/content/legal";
import { loadPage, type PageProps } from "@/content/page";

export async function generateMetadata(props: PageProps) {
  const { lang } = await loadPage(props);
  const doc = getLegal(lang, "privacy");
  return { title: doc.title, description: doc.intro };
}

export default async function PrivacyPolicy(props: PageProps) {
  const { t, lang } = await loadPage(props);
  return <LegalPage doc={getLegal(lang, "privacy")} eyebrow={t.legal.eyebrow} updated={`${t.legal.updated} ${legalUpdated}`} />;
}
