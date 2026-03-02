"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { images, mobileimages, logoSliders } from "@/Data/HeroImages";
const Hero = () => {
  const [index, setIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true); // Track image loading

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setIsLoading(true); // Reset loading state on image change
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="md:relative w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Desktop Image Slider */}
      <div className="hidden md:block relative w-full h-[600px]">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
        <Image
          src={images[index]}
          width={2000}
          height={600}
          className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
          alt="slider"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
        <div className="w-full flex justify-center gap-2 mt-1">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-[2px] w-12 ${idx === index ? "bg-black" : "bg-gray-300"} border-2 border-dashed border-white`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Image Slider */}
      <div className="block md:hidden relative mt-10 w-full h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
        <Image
          src={mobileimages[index]}
          width={800}
          height={400}
          className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
          alt="mobile slider"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
        <div className="w-full flex justify-center gap-2 mt-1">
          {mobileimages.map((_, idx) => (
            <div
              key={idx}
              className={`h-[2px] w-12 ${idx === index ? "bg-black" : "bg-gray-300"} border-2 border-dashed border-white`}
            />
          ))}
        </div>
      </div>

      {/* Logos slider with scroll animation */}
      <Marquee pauseOnHover gradient={false} speed={50}>
        <motion.div
          className="flex justify-evenly px-4 py-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {logoSliders.map((items, index) => (
            <motion.div
              key={index}
              className="flex items-center px-5"
              whileHover={{ scale: 1.1 }}
            >
              <p className="font-medium text-3xl px-5">{items.logos}</p>
              <p>{items.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </Marquee>
    </motion.div>
  );
};

export default Hero;
