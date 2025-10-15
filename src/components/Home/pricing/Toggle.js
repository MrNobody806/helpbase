"use client"
import React, {useState} from 'react'

const Toggle = () => {
      const [billing, setBilling] = useState("monthly");

  return (
     <div className="flex justify-center items-center gap-3 mb-10">
        <span
          className={`text-sm ${
            billing === "monthly" ? "text-black font-medium" : "text-gray-500"
          }`}
        >
          Billed Monthly
        </span>

        <div className="p-[2px] rounded-full bg-gradient-to-r from-red-400 via-pink-500 to-purple-500">
          <button
            onClick={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
            className="w-12 h-6 rounded-full bg-black relative flex items-center"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                billing === "monthly" ? "translate-x-1" : "translate-x-6"
              }`}
            ></span>
          </button>
        </div>

        <span
          className={`text-sm ${
            billing === "yearly" ? "text-black font-medium" : "text-gray-500"
          }`}
        >
          Billed yearly
        </span>
      </div>
  )
}

export default Toggle