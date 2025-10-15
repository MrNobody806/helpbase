import React from "react";

const Button = ({ text, type, className }) => {
    const baseClass="relative rounded-full font-bold text-white transition hover:scale-105 active:scale-95overflow-hidden"
  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
    >
      {/* Gradient border */}
      <span
        className="
          absolute inset-0
          rounded-full
          p-[2px] 
          bg-gradient-to-r from-[#8D92F2] to-[#B3B6F2]
        "
      >
        {/* Inner button background */}
        <span
          className="
            relative
            flex items-center justify-center
            w-full h-full
            rounded-full
            bg-gradient-to-r from-[#716DF2] via-[#777DF2] to-[#908BFF]
            shadow-[4px_4px_10px_rgba(0,0,0,0.15),-4px_-4px_10px_rgba(255,255,255,0.6)]
          "
        >
          {/* Glossy highlight */}
          <span
            className="
    absolute -top-2 -bottom-2 -left-2 -right-2
    rounded-full
    bg-gradient-radial from-white/50 via-white/20 to-transparent
    opacity-50
    pointer-events-none
  "
          ></span>

          {/* Button text */}
          <span className="relative z-10 flex items-center justify-center w-full h-full">
            {text}
          </span>
        </span>
      </span>
    </button>
  );
};

export default Button;
