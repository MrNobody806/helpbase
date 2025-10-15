"use client";
import React from "react";
import { Smartphone, Apple, Play, Star } from "lucide-react";

const stats = [
  { number: "65k+", label: "Downloads", icon: Smartphone },
  { number: "24k+", label: "Active Users", icon: Apple },
  { number: "22k+", label: "Active Users", icon: Play },
  { number: "98%", label: "Client Satisfaction", icon: Star },
];

const Stats = () => {
  return (
    <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, i) => (
        <div
          key={i}
          className="relative bg-[#E8E4E2] rounded-xl shadow-sm p-8 flex flex-col justify-center items-center text-center border border-gray-200 gap-3"
        >
          {/* Divider image */}
          <div className="relative w-full mb-6 flex justify-center">
            <img
              src="/assets/images/about/divider.svg"
              alt="Divider"
              className="w-full max-w-[160px] object-contain"
            />

            {/* Icon box absolutely centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-500 p-[2px] rounded-2xl">
              <div className="bg-black rounded-xl p-3 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          {/* Numbers & Labels */}
          <h3 className="text-2xl font-bold">{item.number}</h3>
          <p className="text-gray-700">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
