"use client";

import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel"; 

const images = [
  { src: "/Offers/offer1.jpg", alt: "Image 1" },
  { src:  "/Offers/offer2.jpg", alt: "Image 2" },
  { src: "/Offers/offer3.jpg", alt: "Image 3" },
  { src: "/Offers/offer4.jpg", alt: "Image 3" },
  { src: "/Offers/offer5.jpg", alt: "Image 3" },
  { src: "/Offers/offer6.jpg", alt: "Image 3" },
  { src: "/Offers/offer7.jpg", alt: "Image 3" },
  { src: "/Offers/offer8.jpg", alt: "Image 3" },
];

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
