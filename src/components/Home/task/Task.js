"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Network, Star, Users, Bell } from "lucide-react";

const features = [
  {
    icon: <Network className="w-6 h-6 text-red-500" />,
    title: "Timeline View",
    desc: "Visualize tasks and deadlines at a glance.",
  },
  {
    icon: <Star className="w-6 h-6 text-purple-500" />,
    title: "Project Management",
    desc: "Manage projects with priorities and due dates.",
  },
  {
    icon: <Users className="w-6 h-6 text-green-500" />,
    title: "Collaboration",
    desc: "Connect through task comments and updates.",
  },
  {
    icon: <Bell className="w-6 h-6 text-orange-500" />,
    title: "Notifications",
    desc: "Stay updated with alerts for key changes.",
  },
];

const Task = () => {
  const dashboardRef = useRef(null);
  const overlayRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: dashboardRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: overlayProgress } = useScroll({
    target: overlayRef,
    offset: ["start end", "end start"],
  });

  const dashboardX = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const overlayX = useTransform(overlayProgress, [0, 1], [-50, 50]);

  return (
    <section
      className="max-w-7xl mx-auto px-6 lg:px-8 md:py-22 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#F4F2F1]"
      id="features"
    >
      {/* Left Content */}
      <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left w-full">
        <span className="inline-block text-sm border border-gray-300 bg-white rounded-full p-3 font-semibold">
          Task Management
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 max-w-5xl leading-tight relative z-10 my-5 font-switzer">
          All Your Tasks, <br /> Organized Effortlessly
        </h2>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col space-y-2 items-start text-left relative ${
                idx % 2 === 0
                  ? "sm:border-r sm:border-gray-300 sm:pr-5"
                  : "sm:pl-5"
              }`}
            >
              <div>{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Images */}
      <div
        className="relative flex justify-center bg-[#FFFFFF] p-5 rounded-md overflow-hidden w-full"
        ref={dashboardRef}
      >
        <motion.img
          src="/assets/images/task/dasboard.svg"
          alt="Main screenshot"
          className="rounded-2xl shadow-lg w-full max-w-lg h-auto"
          style={{ x: dashboardX }}
        />

        <motion.img
          ref={overlayRef}
          src="/assets/images/task/branding.svg"
          alt="Overlay screenshot"
          className="absolute bottom-10 left-45 -translate-x-1/2 rounded-xl shadow-xl border border-gray-200 z-10 w-[60%] sm:w-[40%]"
          style={{ x: overlayX }}
        />
      </div>
    </section>
  );
};

export default Task;
