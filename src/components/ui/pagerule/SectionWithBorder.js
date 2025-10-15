import React from "react";

const SectionWithBorder = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen flex items-center">
      {/* Vertical border line */}
      <div className="absolute left-8 top-0 h-full border-l-2 border-gray-200"></div>

      {/* Circle centered on the line */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gray-300 rounded-full"></div>

      {/* Section content */}
      <div className="ml-20 w-full">{children}</div>
    </div>
  );
};



export default SectionWithBorder;
