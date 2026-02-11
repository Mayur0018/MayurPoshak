"use client";
import React, { useEffect, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineTruck } from "react-icons/hi2";
import { Ri24HoursLine } from "react-icons/ri";
import { LuCodesandbox } from "react-icons/lu";
import Image from "next/image";
import Slider4 from "./Slider4";
import { motion } from "framer-motion";
const logoSliders = [
  { id: 1, logos: TbTruckDelivery, name: "FREE DELIVERY" },
  { id: 2, logos: Ri24HoursLine, name: "ORDERS DISPATCH WITHIN 24 HOURS" },
  { id: 3, logos: HiOutlineTruck, name: "COD AVAILABLE" },
  { id: 4, logos: LuCodesandbox, name: "RETURN/EXCHANGE" },
];

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => setLoading(false), 1500); // Simulate loading delay
    return () => clearTimeout(delay);
  }, []);

  return (
    <>
      <motion.div
        className="py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-1xl md:text-2xl font-semibold text-center">About Mayur Poshak💁‍♂️</h1>
          <Slider4 />
        <p className="text-center max-w-3xl mt-6 mx-auto px-4 md:px-6 text-[14px] md:text-[16px] leading-relaxed font-medium">
          Step into the world of bumchiq, where fashion gets a funky twist.
          Unleash your inner trendsetter with our one-of-a-kind, offbeat prints.
          We're not just a clothing brand; we're a statement, and you're the voice. Explore the extraordinary!
        </p>
 
        <div className="py-4 justify-center md:gap-8 gap-2 flex px-2 mt-6 flex-wrap">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse text-center p-4">
                  <div className="h-12 w-12 md:h-20 md:w-20 bg-gray-300 rounded-full mx-auto mb-2" />
                  <div className="h-3 w-24 bg-gray-300 rounded mx-auto" />
                </div>
              ))
            : logoSliders.map((item, index) => {
                const Logos = item.logos;
                return (
                  <motion.div
                    key={item.id}
                    className="flex flex-col items-center hover:shadow-md transition text-center p-4"
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  >
                    <Logos className="md:text-5xl text-3xl text-black mb-2" />
                    <p className="font-medium md:text-sm text-[8px]">{item.name}</p>
                  </motion.div>
                );
              })}
        </div>
      </motion.div>

      {/* Instagram Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-1xl md:text-2xl font-semibold text-center">Mayur Poshak is on insta!</h1>
        {loading ? (
          <div className="w-full md:w-[1100px] h-60 bg-gray-300 animate-pulse rounded-xl block mx-auto py-6" />
        ) : (
          <Image
            src="/bannerimg.jpg"
            width={1000}
            height={600}
            alt="insta-banner"
            className="w-full md:w-[1100px] rounded-xl md:rounded-md block mx-auto py-6"
          />
        )}
      </motion.div>

      {/* Details Section */}
      <motion.div
        className="md:px-48 mt-10 px-5 mb-10"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className="font-semibold text-[10px]">Founded: 2024</p>
        <p className="text-gray-500 text-[10px]">Born in India, for global stage</p>

        <div className="grid grid-cols-1 md:flex md:justify-center md:items-center md:gap-32 md:py-6">
          <div>
            <h1 className="font-extrabold text-[20px]">Pan India</h1>
            <p className="text-gray-500 text-[10px]">Regions Served</p>
          </div>
          <div>
            <h1 className="font-extrabold text-[20px]">Strong Fanbase</h1>
            <p className="text-gray-500 text-[10px]">
              Boys reorder their fav tee every month. Strong fan base.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:flex gap-10 mt-5">
          {(loading ? Array.from({ length: 2 }) : [0, 1]).map((_, index) => {
            if (loading) {
              return (
                <div
                  key={index}
                  className="bg-gray-300 h-[140px] w-full md:w-[300px] rounded-lg animate-pulse"
                />
              );
            }

            const info = [
              {
                title: "OUR MISSION",
                text: "To empower men to wear meaningfully designed streetwear that boosts confidence and celebrates individuality.",
              },
              {
                title: "Our Vision",
                text: "To redefine men’s streetwear in India by merging meaningful messages with bold design, building a loyal community that values style with substance.",
              },
            ][index];

            return (
              <motion.div
                key={index}
                className="bg-gray-200 px-8 py-8 rounded-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <h1 className="text-center font-extrabold">{info.title}</h1>
                <p className="text-[10px] py-3">{info.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, duration: 0.8 }}
        >
          <h1 className="md:text-5xl text-2xl font-medium py-5">
            Ready to Join the MayurPoshak Movement?
          </h1>
          <button className="md:w-auto text-[12px] text-white px-5 py-2 md:py-2 md:px-10 bg-black rounded-lg">
            Shop Now
          </button>
        </motion.div>
      </motion.div>
     
    </>
  );
};

export default About;
