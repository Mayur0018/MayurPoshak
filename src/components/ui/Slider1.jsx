"use client";
import { CardCarousel } from "@/components/ui/card-carousel";
const Slider1 = () => {
  return (
    <div className="w-full">
      <CardCarousel
        images={cards}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  );
};

export default Slider1;

// Image Data
const cards = [
  { src: "/Classic/classicsarees6.jpg", id: 2, alt: "Image 1" },
  { src: "/Classic/classicsarees7.jpg", id: 3, alt: "Image 1" },
  { src: "/Classic/classicsarees8.jpg", id: 4, alt: "Image 1" },
  { src: "/Classic/classicsarees9.jpg", id: 5, alt: "Image 1" },
  { src: "/Classic/classicsarees10.jpg", id: 6, alt: "Image 1" },
];
