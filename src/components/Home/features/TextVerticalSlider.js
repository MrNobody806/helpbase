"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

const items = [
  "lack of collaboration",
  "task overload",
  "missed deadlines",
  "disorganized workflows",
  "unnecessary complexity",
];

const TextVerticalSlider = () => {
  const [index, setIndex] = useState(0);
  const itemHeight = 70;
  const visibleCount = 5;
  const intervalRef = useRef(null);

  const loopItems = useMemo(() => [...items, ...items], []);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    stopAnimation();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % (items.length * 2));
    }, 2000);
  }, [stopAnimation]);

  useEffect(() => {
    startAnimation();
    return stopAnimation;
  }, [startAnimation, stopAnimation]);

  return (
    <div className="max-w-7xl py-6 w-full flex items-center justify-center gap-4 md:gap-8 flex-col md:flex-row">
      <h2 className="md:text-5xl text-3xl font-bold text-black whitespace-nowrap relative text-center md:text-left font-switzer">
        Wave goodbye to
        <span className="absolute md:-right-10 md:-top-20 hidden md:block">
          <img
            src="/assets/images/features/arrow.svg"
            alt="arrow"
            width={150}
            height={80}
            loading="lazy"
          />
        </span>
      </h2>

      <div
        className="relative overflow-hidden text-left"
        style={{
          height: `${itemHeight * visibleCount}px`,
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div
          className="flex flex-col transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateY(-${index * itemHeight}px)`,
          }}
        >
          {loopItems.map((item, i) => {
            const centerIndex = index + Math.floor(visibleCount / 2);
            const isActive = i === centerIndex;

            return (
              <p
                key={i}
                className={`md:text-5xl text-3xl font-bold whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent"
                    : "text-gray-400"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  lineHeight: `${itemHeight}px`,
                }}
              >
                {item}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TextVerticalSlider);
