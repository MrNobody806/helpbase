"use client";
import React from "react";
import { Check } from "lucide-react";
import Toggle from "./Toggle";
import Header from "./Header";
import Footer from "./Footer";

const plans = [
  {
    name: "Basic",
    desc: "Perfect for small teams and startups.",
    price: 10,
    features: [
      "Task Management",
      "AI Summary",
      "Progress Tracking",
      "Smart Labels",
    ],
    button: "Get Started",
    icon: "🦋",
    highlight: false,
  },
  {
    name: "Pro",
    desc: "Ideal for growing teams and projects.",
    price: 25,
    features: [
      "Everything in Basic +",
      "Team Collaboration",
      "Bulk Actions",
      "2-way Translation",
      "Advanced Reporting",
      "Customizable Dashboards",
      "Priority Support",
    ],
    button: "Start 7-day free trial",
    icon: "🍊",
    highlight: true,
  },
  {
    name: "Enterprise",
    desc: "Built for large organizations needs.",
    price: 39,
    features: [
      "Everything in Basic +",
      "SAML SSO",
      "Dedicated Account Manager",
      "Enterprise Integrations",
      "Data Analytics",
      "Security Enhancements",
      "Custom Workflows",
    ],
    button: "Start 7-day free trial",
    icon: "🌸",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section
      className="md:py-22 py-5 px-4 md:px-8 max-w-7xl mx-auto bg-[#F4F2F1] flex flex-col items-center"
      id="pricing"
    >
      {/* Section Header */}
      <Header />

      {/* Billing Toggle */}
      <div className="flex justify-center mb-10">
        <Toggle />
      </div>

      {/* Pricing Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16 justify-items-center">
        {plans.map((plan, idx) => {
          const card = (
            <div className="w-full sm:max-w-[360px] md:w-[480px] rounded-2xl overflow-hidden border border-gray-200 flex flex-col bg-[#E8E4E2] shadow-sm h-full">
              <div className="p-6 text-left rounded-2xl bg-white shadow-md">
                <div className="text-3xl mb-2">{plan.icon}</div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.desc}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-sm text-gray-600 ml-1">
                    per member / month
                  </span>
                </div>
                <button className="mt-6 w-full rounded-md bg-black text-white py-3 text-sm font-medium hover:opacity-90">
                  {plan.button}
                </button>
              </div>

              <div className="px-6 py-6 flex-1">
                <ul className="space-y-3 text-md text-black">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );

          return plan.highlight ? (
            <div
              key={idx}
              className="w-full sm:max-w-[364px] md:w-[484px] p-[2px] rounded-2xl bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 shadow-lg"
            >
              {card}
            </div>
          ) : (
            <div
              key={idx}
              className="w-full sm:max-w-[360px] md:w-[480px] shadow-md rounded-2xl"
            >
              {card}
            </div>
          );
        })}
      </div>

      {/* Footer Perks – same width as pricing grid */}
      <Footer />
    </section>
  );
}
