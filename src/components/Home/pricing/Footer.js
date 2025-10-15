import React from 'react';

const Footer = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      {/* Top banner */}
      <div
        className="flex flex-col md:flex-row w-full md:max-w-8xl items-center md:justify-between justify-center
                   rounded-md bg-[#ebe8e6] px-4 py-2 shadow-sm space-y-2 md:space-y-0"
      >
        <p className="text-sm md:text-base text-center md:text-left">
          We just launched our startup program –{" "}
          <span
            className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500
                       bg-clip-text text-transparent font-semibold"
          >
            Get 50% off
          </span>
        </p>
        <button className="rounded-md bg-white px-4 py-2 text-sm font-medium shadow hover:bg-gray-50">
          Apply Now
        </button>
      </div>

      {/* Bottom perks */}
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6 space-y-2 md:space-y-0 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Free 7 days trial
        </div>

        <span className="hidden md:inline text-gray-400">·</span>

        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.25 8.25h19.5M2.25 12h19.5M2.25 15.75h19.5"
            />
          </svg>
          No credit card required
        </div>

        <span className="hidden md:inline text-gray-400">·</span>

        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 8c-1.657 0-3 1.343-3 3m6 0c0-1.657-1.343-3-3-3m0 0v13m-6-8h12"
            />
          </svg>
          Data migration
        </div>
      </div>
    </div>
  );
};

export default Footer;
