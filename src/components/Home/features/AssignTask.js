"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Dummy avatars
const avatars = [
  "/assets/images/features/user-01.png",
  "/assets/images/features/user-02.png",
  "/assets/images/features/user-03.png",
  "/assets/images/features/user-04.png",
];

const AssignTask = () => {
  return (
    <div className="w-full absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
      {/* Assign Task Button */}
      <div className="bg-gradient-to-r from-purple-500 to-orange-400 p-[2px] rounded-full shadow-md">
        <button className="px-4 py-1.5 text-sm bg-black text-white rounded-full flex items-center gap-1">
          Assign Task <span className="text-[11px]">▼</span>
        </button>
      </div>

      {/* Connector line */}
      <div className="relative w-px h-[calc(30px+2px)] bg-red-500 -mt-3 -mb-3"></div>

      {/* Avatar Carousel */}
      <div className="bg-gradient-to-r from-purple-500 to-orange-400 p-[2px] rounded-full w-[240px] h-[50px] overflow-hidden shadow-md">
        <div className="bg-black w-full h-full rounded-full flex items-center">
          <motion.div
            className="flex gap-3 items-center px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 12,
              repeat: Infinity,
            }}
          >
            {[...avatars, ...avatars].map((src, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex-shrink-0"
              >
                <Image
                  src={src}
                  alt={`User ${i}`}
                  width={40}
                  height={40}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;
