"use client";
import React from "react";
import { Star } from "lucide-react";
import Stats from "./Stats";

const About = () => {
  return (
    <section className="md:py-22 py-5 px-4 md:px-8 max-w-7xl mx-auto" id="about">
      <div className="relative mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-md md:p-6 p-3">
        {/* Background gradient image */}
        <img
          src="/assets/images/about/back.svg"
          alt="Background"
          className="absolute md:top-0 right-0 bottom-0 max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto object-contain z-0"
        />

        {/* Left Content */}
        <div className="h-full relative z-10 flex flex-col justify-center md:items-start items-center gap-4 p-8">
          <span className="bg-[#E8E4E2] inline-block text-sm font-semibold border border-gray-300 rounded-full px-3 py-2">
            About Us
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-5xl md:text-left text-center leading-tight relative z-10 font-switzer">
            The Journey <br /> Behind Prismo
          </h2>

          <p className="text-gray-800 text-md font-medium md:text-left text-center max-w-2xl">
            At Prismo, we believe in empowering teams with intuitive task
            management solutions. Our platform is designed to optimize
            workflows, enhance collaboration, and drive success, helping
            businesses stay organized and efficient, no matter their size or
            industry.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button className="px-6 py-3 rounded-md bg-black text-white font-medium hover:opacity-90">
              Contact Us
            </button>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-lg">G</span>
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm">4.9 Average user rating</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center items-center relative z-10">
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/assets/images/about/main.svg"
              alt="Team"
              className="rounded-xl w-full h-auto object-cover"
            />
          </div>

          {/* Labels with images */}
          <img
            src="/assets/images/about/andrew.png"
            alt="Andrew"
            className="md:w-40 md:h-40 w-30 h-30 absolute md:top-29 md:left-2 top-20 left-0"
          />

          <img
            src="/assets/images/about/jhonson.png"
            alt="Johnson"
            className="md:w-40 md:h-40 w-30 h-30 absolute md:bottom-20 md:left-30 bottom-10 left-20"
          />

          <img
            src="/assets/images/about/mathew.png"
            alt="Mathew"
            className="md:w-40 md:h-40 w-30 h-30 absolute md:top-35 md:right-0 top-20 right-0"
          />
        </div>
      </div>

      {/* Stats Section */}
      <Stats/>
    </section>
  );
};

export default About;
