import Image from "next/image";

import Header from "@/components/ui/layout/header/Header";
import Hero from "@/components/Home/hero/Hero";
import Features from "@/components/Home/features/Features";
import Pricing from "@/components/Home/pricing/Pricing";
import Testimonials from "@/components/Home/testimonials/TestimonialSlider";
import Comparison from "@/components/Home/comparison/Comparison";
import About from "@/components/Home/about/About";
import Task from "@/components/Home/task/Task";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F2F1]  flex flex-col items-center overflow-hidden">
      {/* Navigation */}
      <Header />
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Task />
      <Features />
      {/* Testimonials */}
      <Testimonials />
      {/* Pricing Section */}
      <About />
      <Pricing />
      <Comparison />
    </div>
  );
}
