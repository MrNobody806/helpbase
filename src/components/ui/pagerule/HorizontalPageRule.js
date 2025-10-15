import React from 'react'

const HorizontalPageRule = () => {
  return (
    <div className="relative w-full flex items-center">
      {/* Left circle */}
      <div className="absolute left-[calc(100%-97.8%)] sm:left-[calc(100%-96.9%)] md:left-[calc(100%-96.7%)]  lg:left-[calc(100%-96.6%)] xl:left-[calc(100%-96.4%)] 2xl:left-[calc(100%-96.2%)] w-4 h-4 bg-white border-2 border-gray-300 rounded-full top-1/2 -translate-y-1/2 "></div>
      {/* Divider line */}
      <div className="w-full border-t-4 border-gray-100"></div>
      {/* Right circle */}
      <div className="absolute right-[calc(100%-97.8%)] sm:right-[calc(100%-96.9%)] md:right-[calc(100%-96.7%)] lg:right-[calc(100%-96.6%)] xl:right-[calc(100%-96.4%)] 2xl:right-[calc(100%-96.2%)] w-4 h-4 bg-white border-2 border-gray-300 rounded-full top-1/2 -translate-y-1/2 "></div>
    </div>
  )
}

export default HorizontalPageRule
