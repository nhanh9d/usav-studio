import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './booster.css';
import Providers from '@/components/booster/Providers';
import { boosterDictionaries, LANG_COOKIE, resolveLocale } from '@/lib/boosterI18n';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

async function getLocale() {
  return resolveLocale((await cookies()).get(LANG_COOKIE)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  return boosterDictionaries[await getLocale()].meta;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
