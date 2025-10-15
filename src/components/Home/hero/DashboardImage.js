"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function DashboardImage() {
  const ref = useRef(null);

  // Track scroll progress of this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // from entering to leaving viewport
  });

  // Stronger scale effect: from 0.9 → 1.1 → 0.9
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);

  return (
    <motion.div
      ref={ref}
      className="relative max-w-7xl mx-auto px-6 lg:px-8 md:py-22 py-16"
    >
      <motion.img
        src="/assets/images/dashboard-dark.webp"
        alt="dashboard"
        className="rounded-2xl shadow-2xl border w-full "
        style={{
          scale,
        }}
      />
    </motion.div>
  );
}
