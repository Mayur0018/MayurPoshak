"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";

/* ================= DATA ================= */

export const items = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1635347410819-127e5bd66b9c?auto=format&fit=crop&q=80&w=2400",
    title: "MAXX PHAM",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1582461420964-9e1ecbbbd138?auto=format&fit=crop&q=80&w=2400",
    title: "People Walking in Luxury Store",
  },
  {
    id: 3, // or any unique ID
    url: "https://images.unsplash.com/photo-1603802199870-ac76f5733c11?auto=format&fit=crop&q=80&w=2400",
    title: "Urban Street Crowd – Hong Kong",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1707329194702-9380d587bbc1?auto=format&fit=crop&q=80&w=2400",
    title: "People Walking by Store – Chennai",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1667551437470-4e872b132867?auto=format&fit=crop&q=80&w=2400",
    title: "Lonely Boy at Night Storefront",
  },
];

const FULL_ASPECT_RATIO = 16 / 9;
const COLLAPSED_ASPECT_RATIO = 1 / 3;
const MARGIN = 2;
const GAP = 2;

/* ================= MAIN ================= */

function Exhibition() {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const width = containerRef.current.offsetWidth || 1;
      animate(x, -index * width, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, isDragging, x]);

  return (
    <div className="w-full p-4 md:p-8 min-h-screen">
      {/* Animated Title */}
      <motion.h1
        className="text-1xl md:text-2xl font-semibold text-center py-8  text-gray-800"
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        EXHIBITION 🕵️
      </motion.h1>

      <div className="relative overflow-hidden rounded-2xl" ref={containerRef}>
        <motion.div
          className="flex"
          drag="x"
          dragElastic={0.2}
          dragMomentum={false}
          style={{ x }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, info) => {
            setIsDragging(false);
            const width = containerRef.current?.offsetWidth || 1;
            const threshold = width * 0.3;

            if (Math.abs(info.offset.x) > threshold) {
              setIndex((i) =>
                info.offset.x > 0
                  ? Math.max(i - 1, 0)
                  : Math.min(i + 1, items.length - 1),
              );
            } else {
              animate(x, -index * width, {
                type: "spring",
                stiffness: 300,
                damping: 30,
              });
            }
          }}
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="w-full shrink-0 aspect-[16/9] min-h-[400px] md:min-h-[60vh]"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover rounded-2xl pointer-events-none select-none"
                draggable={false}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Thumbnails index={index} setIndex={setIndex} />
    </div>
  );
}

/* ================= THUMBNAILS ================= */

function Thumbnails({ index, setIndex }) {
  const x =
    index * 100 * (COLLAPSED_ASPECT_RATIO / FULL_ASPECT_RATIO) +
    MARGIN +
    index * GAP;

  const spring = useSpring(x, { bounce: 0 });
  const xPercent = useMotionTemplate`-${spring}%`;

  useEffect(() => {
    spring.set(x);
  }, [x, spring]);

  return (
    <div className="flex h-20 md:h-24 justify-center overflow-hidden mt-6 md:mt-10">
      <motion.div
        className="flex items-center"
        style={{ x: xPercent, gap: `${GAP}%` }}
      >
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => setIndex(i)}
            animate={i === index ? "active" : "inactive"}
            variants={{
              active: {
                scale: 1.18,
                aspectRatio: FULL_ASPECT_RATIO,
                opacity: 1,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              },
              inactive: {
                scale: 1,
                aspectRatio: COLLAPSED_ASPECT_RATIO,
                opacity: 0.7,
              },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="h-full shrink-0 rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={`${item.url}&w=400`} // Slightly higher res for better thumb quality
              alt={item.title}
              className="h-full w-full object-cover pointer-events-none"
            />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

export default Exhibition;
