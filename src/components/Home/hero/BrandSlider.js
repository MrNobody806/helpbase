"use client";
import { motion } from "framer-motion";

const logos = [
  "/assets/images/brands/logo-01.svg",
  "/assets/images/brands/logo-02.svg",
  "/assets/images/brands/logo-03.svg",
  "/assets/images/brands/logo-04.svg",
];

export default function BrandSlider() {
  // Duplicate the list to create a seamless loop
  const items = [...logos, ...logos];

  return (
    <div className="px-4 md:px-8 w-full max-w-7xl mx-auto py-8">
      <h2 className="text-center text-gray-700 font-medium mb-8">
        Backed by the best
      </h2>

      {/* Container showing only 60% of the width */}
      <div className="md:w-[60%] w-[80%] mx-auto overflow-hidden">
        <motion.div
          className="flex gap-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          {items.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt={`brand-${i}`}
              className="h-10 w-auto grayscale opacity-70 hover:opacity-100 transition"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
