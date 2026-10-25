import type { Metadata } from "next";
import { Barlow_Condensed, Be_Vietnam_Pro } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, locales } from "@/content/site";
import "../globals.css";

const body = Be_Vietnam_Pro({
  variable: "--font-usav-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const display = Barlow_Condensed({
  variable: "--font-usav-display",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

// Applies the saved theme before first paint so a light-mode visitor never sees a dark flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    metadataBase: new URL("https://usavstudio.com"),
    title: { default: meta.title, template: "%s | USAV Studio" },
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, type: "website", locale: lang, siteName: "USAV Studio",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "USAV Studio" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <Header lang={lang} nav={t.nav} />
        {children}
        <footer className="border-t border-line py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <Logo />
              <p className="mt-3 text-sm text-muted">{t.footer.tagline}</p>
            </div>
            <div className="max-w-sm text-xs leading-relaxed text-muted sm:text-right">
              <nav aria-label={t.legal.eyebrow} className="flex gap-4 sm:justify-end">
                <Link href={`/${lang}/terms-of-service`} className="hover:text-heading">
                  {t.legal.terms}
                </Link>
                <Link href={`/${lang}/privacy-policy`} className="hover:text-heading">
                  {t.legal.privacy}
                </Link>
              </nav>
              <p className="mt-2">
                © {new Date().getFullYear()} USAV Studio. {t.footer.rights}
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
