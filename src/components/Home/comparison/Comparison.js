import React from "react";

const Comparison = () => {
  const otherFeatures = [
    "Limited Task Customization",
    "Slow Progress Tracking",
    "Complex User Interface",
    "Manual Data Entry Required",
    "Lack of Seamless Integration",
    "No Bulk Actions Support",
    "Inconsistent Document Management",
    "Limited Reporting Features",
  ];

  const prismoFeatures = [
    "Everything in Basic +",
    "Real-Time Progress Updates",
    "Intuitive User Experience",
    "Automated Data Entry",
    "Seamless Integrations Across Tools",
    "Powerful Bulk Action Support",
    "Efficient Document Organization",
    "Comprehensive Reporting Insights",
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 md:py-22 py-5"
      id="comparison"
    >
      {/* Top Tag */}
      <div className="inline-block text-sm border border-gray-300 bg-white rounded-full p-3 mb-4">
        Comparison
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-6xl font-bold text-gray-900 max-w-5xl leading-tight relative z-10 text-center font-switzer">
        What Sets Prismo Apart
      </h2>

      {/* Subheading */}
      <p className="text-gray-600 mt-3 text-center max-w-2xl">
        Discover how Prismo outperforms other platforms with superior features,
        better performance, and unmatched ease of use.
      </p>

      {/* Comparison Section */}
      <div className="mt-10 flex flex-col md:flex-row items-stretch gap-6 relative">
        {/* Other Platforms */}
        <div className="bg-[#E8E4E2] rounded-2xl p-6 flex flex-col w-full sm:w-[350px] md:w-[400px]">
          <h3 className="text-lg font-bold text-gray-800 text-center pb-4 border-b border-gray-300 relative">
            OTHER PLATFORMS
          </h3>
          <ul className="mt-6 space-y-4 text-gray-700 flex-1">
            {otherFeatures.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                {/* Gray shield icon */}
                <span className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-200 text-gray-600 text-sm">
                  🛡
                </span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* VS Divider */}
        <div className="relative flex items-start justify-center">
          <div className="bg-black text-white text-xs font-semibold rounded-full px-3 py-2 mt-2 z-10">
            V/S
          </div>

          {/* Left Arrow */}
          <img
            src="/assets/images/comparison/left-arrow.svg" // replace with your arrow image path
            alt="arrow left"
            className="hidden md:block absolute left-[-30px] top-5.5 w-12 h-auto"
          />

          {/* Right Arrow */}
          <img
            src="/assets/images/comparison/right-arrow.svg" // replace with your arrow image path
            alt="arrow right"
            className="hidden md:block absolute right-[-30px] top-5.5 w-12 h-auto"
          />
        </div>

        {/* Prismo Section with Gradient Border */}
        <div className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 rounded-2xl p-[2px] flex w-full sm:w-[350px] md:w-[400px]">
          <div className="bg-white rounded-2xl p-6 flex flex-col w-full">
            <h3 className="text-lg font-bold text-gray-800 text-center pb-4 border-b border-gray-300 relative">
              ✺ Prismo
            </h3>

            {/* Feature List */}
            <ul className="mt-6 space-y-4 flex-1">
              {prismoFeatures.map((title, i) => (
                <li key={i} className="flex items-start gap-3">
                  {/* Gradient Checkmark Box */}
                  <span
                    className="
                      w-6 h-6 flex items-center justify-center 
                      rounded-md p-[1px]
                      bg-gradient-to-br from-purple-500 to-orange-400
                      shadow-2xl
                    "
                  >
                    <span className="w-full h-full flex items-center justify-center rounded-md bg-black text-white text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="white"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>

                  <p className="text-gray-700">{title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button className="mt-10 bg-black text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition">
        Start 7-day free trial
      </button>
    </div>
  );
};

export default Comparison;
