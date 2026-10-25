import HeroBanner from '@/components/booster/home/HeroBanner';
import FeaturedProducts from '@/components/booster/home/FeaturedProducts';
import ServicesSection from '@/components/booster/home/ServicesSection';
import MinigamePreview from '@/components/booster/home/MinigamePreview';
import FAQSection from '@/components/booster/home/FAQSection';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <ServicesSection />
      <MinigamePreview />
      <FAQSection />
    </>
  );
}
