"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

// Shimmer placeholder
const Shimmer = () => (
  <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
);

const ImageCarousel2 = () => {
  const carouselRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = slider2Cards.length;

  const handleImageLoad = (id) => {
    setTimeout(() => {
      setLoadedImages((prev) => ({ ...prev, [id]: true }));
    }, 300);
  };

  const scrollToIndex = (index) => {
    const container = carouselRef.current;
    if (container) {
      const slideWidth = container.clientWidth;
      container.scrollTo({ left: index * slideWidth, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    const nextIndex = Math.min(currentIndex + 1, totalSlides - 1);
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  return (
    <section className="relative w-full overflow-hidden py-10">
      {/* Left Button */}
      <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-200 disabled:opacity-40"
        >
          <FaChevronLeft size={20} />
        </button>
      </div>

      {/* Right Button */}
      <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2">
        <button
          onClick={handleNext}
          disabled={currentIndex === totalSlides - 1}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-200 disabled:opacity-40"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Banner Carousel */}
      <div
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out snap-x snap-mandatory overflow-x-hidden"
      >
        {slider2Cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="
              w-full flex-shrink-0 relative
              h-[220px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[420px]
              max-w-[900px] mx-auto snap-center
            "
          >
            {!loadedImages[card.id] && <Shimmer />}
            <Image
              src={card.url}
              alt={`banner-${card.id}`}
              fill
              className={`object-cover w-full h-full transition-opacity duration-500 ease-in-out ${
                loadedImages[card.id] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleImageLoad(card.id)}
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ImageCarousel2;

// Banner image data
const slider2Cards = [
  { url: "/Banner/sareesbanner.jpg", id: 101 },
  { url: "/Banner/sareesbanner.jpg", id: 102 },
  { url: "/Banner/sareesbanner.jpg", id: 103 },
  { url: "/Banner/sareesbanner.jpg", id: 104 },
];
