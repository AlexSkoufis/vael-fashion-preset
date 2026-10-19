import { StoreProvider } from '@/lib/store';
import SmoothScroll from '@/components/SmoothScroll';
import Reveal from '@/components/Reveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Shop, { Categories } from '@/components/Shop';
import Looks from '@/components/Looks';
import SizeFinder from '@/components/SizeFinder';
import Craft from '@/components/Craft';
import Footer from '@/components/Footer';
import QuickView from '@/components/QuickView';
import Bag from '@/components/Bag';

export default function Page() {
  return (
    <StoreProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      <Reveal />
      <Nav />
      <main id="main">
        <Hero />
        <Categories />
        <Shop />
        <Looks />
        <SizeFinder />
        <Craft />
      </main>
      <Footer />
      <QuickView />
      <Bag />
    </StoreProvider>
  );
}
