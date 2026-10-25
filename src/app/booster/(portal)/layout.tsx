import Header from '@/components/booster/layout/Header';
import Footer from '@/components/booster/layout/Footer';

// The store's bottom MobileNav is left out while the store pages are hidden (see src/proxy.ts).
export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      <Footer />
    </>
  );
}
