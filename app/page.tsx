
import PageTransition from '@/components/layout/PageTransition';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CountdownSection from '@/components/home/CountdownSection';
import SponsorSection from '@/components/sponsors/SponsorSection';

export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
      <FeaturesSection />
      <CountdownSection />
      <SponsorSection />
    </PageTransition>
  );
}
