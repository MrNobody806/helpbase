"use client";
// import React from "react";
import { motion } from "framer-motion";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardImage from "./DashboardImage";
import BrandSlider from "./BrandSlider";

const Hero = () => {
  const router = useRouter();
  const handleJoinWaitlist = useCallback(() => {
    router.push("https://accounts.helpbase.co/signup");
  }, [router]);

  return (
    <section className="w-full relative flex flex-col items-center justify-center text-center px-6 py-6 pt-[130px] bg-[#F4F2F1] overflow-hidden">
      <img
        src="/assets/images/hero/color-gradient.svg"
        alt="Background"
        className="absolute md:top-0 right-0 bottom-0 max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-full object-cover z-0 opacity-80 pointer-events-none"
        loading="eager"
      />
      <img
        src="/assets/images/hero/color-gradient.svg"
        alt="Background"
        className="absolute md:top-0 left-0 bottom-0 max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-full object-cover z-0 opacity-80 pointer-events-none transform scale-x-[-1]"
        loading="eager"
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 p-3 rounded-full bg-white/70 backdrop-blur-md text-base shadow-sm relative z-10 font-semibold"
      >
        <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          200K+
        </span>{" "}
        Daily User
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-gray-900 md:max-w-6xl leading-tight text-center relative z-10 font-switzer"
      >
        Customer Support Made <br /> Fast and Reliable
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl relative z-10"
      >
        Boost customer support with seamless speed.
      </motion.p>

      <motion.div
        className="mt-10 relative z-10"
        onClick={handleJoinWaitlist}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={handleJoinWaitlist}
          className="px-6 py-3 rounded-lg bg-black text-white font-semibold shadow-lg hover:bg-gray-900 transition-colors"
        >
          Secure Your Spot
        </button>
      </motion.div>

      <motion.div
        className="mt-6 flex items-center gap-2 text-gray-700 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="flex text-yellow-500 text-lg">★★★★☆</span>
        <span className="text-sm">4.9 rating Based on 300k Users</span>
      </motion.div>

      <DashboardImage />
      <BrandSlider />
    </section>
  );
};

export default React.memo(Hero);
