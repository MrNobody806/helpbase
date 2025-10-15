import React from "react";

const Header = () => {
  return (
    <div className="text-center mb-12">
      <p className="inline-block text-sm border border-gray-300 bg-white rounded-full p-3 mb-4 font-semibold">
        Pricing & Plans
      </p>
      <h2 className="text-4xl md:text-6xl font-bold text-gray-900 max-w-5xl leading-tight relative z-10 font-switzer">
        Affordable Pricing Plans
      </h2>
      <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
        Flexible, transparent pricing to support your team’s productivity and
        growth at every stage.
      </p>
    </div>
  );
};

export default Header;
