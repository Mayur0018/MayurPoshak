"use client";

import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel";

const images = [
  { src: "/Classic/classicsarees.jpg", alt: "Image 1" },
  { src: "/Classic/classicsarees1.jpg", alt: "Image 2" },
  { src: "/Classic/classicsarees2.jpg", alt: "Image 3" },
  { src: "/Classic/classicsarees3.jpg", alt: "Image 4" },
  { src: "/Classic/classicsarees4.jpg", alt: "Image 5" },
  { src: "/Classic/classicsarees5.jpg", alt: "Image 6" },
];

const Slider3 = () => {
  return (
    <div className="pt-20 w-full">
      <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  );
};

export default Slider3;
