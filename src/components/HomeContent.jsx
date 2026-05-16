'use client';

import {
  HeroBanner,
  FeaturedProducts,
  CategorySection,
  BestSellers,
  PromoBanner,
  FooterBanner,
} from './';
import useCMSStore from '../stores/cmsStore';

const HomeContent = () => {
  const products = useCMSStore((state) => state.products);
  const banners = useCMSStore((state) => state.banners);
  const isLoaded = useCMSStore((state) => state.isLoaded);
  const primaryBanner = banners?.[0];

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-600">
        Loading store...
      </div>
    );
  }

  return (
    <>
      <HeroBanner heroBanner={primaryBanner} />
      <FeaturedProducts products={products} />
      <CategorySection />
      <PromoBanner />
      <BestSellers products={products} />
      <FooterBanner footerBanner={primaryBanner} />
    </>
  );
};

export default HomeContent;
