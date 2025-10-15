"use client";
import React from "react";
import Image from "next/image";
import TestimoniGrid from "./TestimoniGrid";

const testimonials = [
  {
    type: "stat",
    value: "10X",
    label: "Revenue Boost",
    logo: "/logo1.svg",
    bg: "bg-[#FFF2E5]",
  },
  {
    type: "stat",
    value: "2X",
    label: "Increase Efficiency",
    logo: "/logo2.svg",
    bg: "bg-[#EDE3FF]",
  },
  {
    type: "testimonial",
    text: "Prismo has completely transformed how our team manages tasks. The platform has made our workflow seamless and boosted overall productivity.",
    author: "John Matthews",
    role: "Project Manager",
    avatar: "/avatars/john.png",
  },
  {
    type: "testimonial",
    text: "With Prismo, we’ve streamlined our project management, reducing time spent on administrative tasks. It’s user-friendly, and our team is now more efficient than ever.",
    author: "Sarah Collins",
    role: "Operations Lead",
    avatar: "/avatars/sarah.png",
  },
  {
    type: "testimonial",
    text: "We saw a massive improvement in our team’s collaboration and communication. Prismo helped us organize tasks efficiently, leading to better outcomes across all projects.",
    author: "David Chen",
    role: "Team Lead",
    avatar: "/avatars/david.png",
  },
  {
    type: "stat",
    value: "5X",
    label: "Team Growth",
    logo: "/logo3.svg",
    bg: "bg-[#EBFBEF]",
  },
  {
    type: "testimonial",
    text: "We’ve increased our efficiency by at least 40% since implementing Prismo. It’s helped our team stay aligned and deliver exceptional results.",
    author: "Olivia Turner",
    role: "Operations Director",
    avatar: "/avatars/olivia.png",
  },
  {
    type: "stat",
    value: "3X",
    label: "Increased Productivity",
    logo: "/logo4.svg",
    bg: "bg-[#FFE5E9]",
  },
];

const Testimonials = () => {
  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto my-15">
      {/* Section Heading */}
      <div className="text-center mb-5">
        <span className="inline-block text-sm border bg-[#FFFFFF] border-gray-300 rounded-full p-3 mb-4 font-semibold">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-snug font-switzer">
          What Our Users Are <br /> Saying About Us
        </h2>
      </div>
      {/* Grid Layout */}
      <TestimoniGrid />
    </section>
  );
};

export default Testimonials;
