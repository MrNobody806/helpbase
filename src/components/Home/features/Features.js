"use client";
import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AssignTask from "./AssignTask";
import PageDivider from "@/components/ui/pagerule/PageDivider";
import TextVerticalSlider from "./TextVerticalSlider";
import UniqueFeatures from "./UniqueFeatures";

const features = [
  {
    title: "Interactive Timeline",
    text: "Track and organize tasks visually.",
  },
  {
    title: "Custom Fields",
    text: "Tailor tasks to your workflow.",
  },
  {
    title: "Real-Time Sync",
    text: "Stay updated instantly.",
  },
  {
    title: "Team Comments",
    text: "Collaborate directly on tasks.",
  },
];

const FeaturesLeftImage = React.memo(() => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <div
      ref={ref}
      className="relative bg-white md:p-8 p-4 rounded-2xl overflow-hidden h-full flex"
    >
      <motion.div
        className="rounded-2xl shadow-xl overflow-hidden relative flex-1"
        style={{ x }}
      >
        <img
          src="/assets/images/features/feature.png"
          alt="Project Timeline"
          className="rounded-2xl w-full h-full object-cover"
          loading="lazy"
        />
        <AssignTask />
      </motion.div>
    </div>
  );
});

const Features = () => {
  const featureList = useMemo(
    () =>
      features.map((f, i) => (
        <li key={i} className="flex items-start gap-3 w-full">
          <span className="w-6 h-6 flex items-center justify-center rounded-md p-[1.5px] bg-gradient-to-br from-purple-500 to-pink-500 shadow-md shadow-purple-500/40 shrink-0">
            <span className="w-full h-full flex items-center justify-center rounded-md bg-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="white"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </span>
          <p className="text-gray-700 text-sm sm:text-base leading-snug break-words">
            <strong>{f.title}</strong> – {f.text}
          </p>
        </li>
      )),
    []
  );

  return (
    <>
      <div className="w-full flex justify-center">
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="w-full mx-auto grid lg:grid-cols-2 gap-16 justify-between items-stretch md:my-20">
            <FeaturesLeftImage />
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col justify-center"
            >
              <div className="flex flex-col items-center md:items-start">
                <span className="inline-block p-3 font-semibold text-sm text-center md:text-left rounded-full bg-white text-gray-700 mb-4">
                  Powerful Features
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl md:text-left text-center font-bold text-gray-900 leading-tight font-switzer">
                Work Smarter with <br /> Powerful Features
              </h2>
              <p className="mt-4 text-lg md:text-left text-center text-gray-600">
                Effortlessly manage tasks, collaborate with teams, and meet
                deadlines.
              </p>
              <ul className="mt-8 space-y-4 w-full">{featureList}</ul>
            </motion.div>
          </div>
        </section>
      </div>
      <div className="w-full flex flex-col justify-center items-center bg-[#E8E4E2]">
        <PageDivider />
        <TextVerticalSlider />
        <UniqueFeatures />
        <PageDivider />
      </div>
    </>
  );
};

export default React.memo(Features);
