"use client";
import React from "react";
import { CheckSquare, Briefcase, Zap } from "lucide-react";

const stats = [
  {
    type: "images",
    images: [
      "/assets/images/features/u-1.png",
      "/assets/images/features/u-2.png",
      "/assets/images/features/u-3.png",
    ],
    number: "300K+",
    label: "Team Collaborations",
  },
  {
    type: "icon",
    icon: <CheckSquare className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />,
    number: "500K+",
    label: "Tasks Completed",
  },
  {
    type: "icon",
    icon: <Briefcase className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />,
    number: "15M+",
    label: "Projects Managed",
  },
  {
    type: "icon",
    icon: <Zap className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />,
    number: "150K+",
    label: "Successful Integrations",
  },
];

const UniqueFeatures = () => {
  return (
    <div className="w-full max-w-7xl flex justify-center py-15 bg-[#E8E4E2]">
      <div className="relative w-full py-5">
        {/* Divider */}
        <img
          src="/assets/images/divider/divider-01.svg"
          alt="Divider"
          className="w-full h-auto relative z-0"
        />
        {/* Stats Grid */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center -mt-8 sm:-mt-12">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Wrapper ensures same height for all */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                {item.type === "images" ? (
                  <div className="flex items-center justify-center space-x-5">
                    {item.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`user-${idx}`}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover ${
                          idx === 0
                            ? "rotate-10"
                            : idx === 2
                            ? "-rotate-10"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-orange-500 to-purple-500 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-xs sm:text-base">
                      {item.icon}
                    </div>
                  </div>
                )}
              </div>

              {/* Number */}
              <h3 className="mt-4 sm:mt-6 text-lg sm:text-2xl lg:text-3xl font-bold">
                {item.number}
              </h3>

              {/* Label */}
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniqueFeatures;
