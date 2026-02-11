"use client";

import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel";

// Auto-generate sareesoffer1.jpg → sareesoffer5.jpg
const images = Array.from({ length: 5 }, (_, i) => ({
  src: `/Offers/sareesoffer${i + 1}.jpg`,
  alt: `Saree Offer ${i + 1}`,
}));

const Slider5 = () => {
  return (
    <div className="w-full">
      <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  );
};

export default Slider5;
