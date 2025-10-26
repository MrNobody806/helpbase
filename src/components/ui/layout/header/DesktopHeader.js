"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const DesktopHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const handleInstantScrollTop = useCallback((e) => {
    e.preventDefault();
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0 });
    window.history.replaceState(null, "", window.location.pathname);
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 50);
  }, []);

  const handleJoinWaitlist = useCallback(() => {
    router.push("https://accounts.helpbase.co/signup");
  }, [router]);

  const navItems = [
    { href: "#home", label: "Home", onClick: handleInstantScrollTop },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
    { href: "#comparison", label: "Comparison" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none">
      <motion.div
        layout
        initial={false}
        animate={{
          width: isScrolled ? "70%" : "100%",
          borderRadius: isScrolled ? "1rem" : "0rem",
          marginTop: isScrolled ? "0.75rem" : "0rem",
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-7xl pointer-events-auto"
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit] backdrop-blur-lg"
          animate={{
            backgroundColor: isScrolled
              ? "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0)",
            boxShadow: isScrolled
              ? "0 4px 20px rgba(0,0,0,0.08)"
              : "0 0 0 rgba(0,0,0,0)",
          }}
          transition={{ duration: isScrolled ? 0.35 : 0.1, ease: "easeInOut" }}
        />

        <div
          className={`relative flex items-center justify-between px-4 ${
            isScrolled ? "py-2" : "py-4"
          }`}
        >
          <div className="flex items-center gap-2 text-gray-900">
            <img
              src="/logo_dark.svg"
              alt="HelpBase"
              className={`transition-all duration-300 ${
                isScrolled ? "h-6 w-auto" : "h-8 w-auto"
              }`}
            />
          </div>

          <nav className="hidden md:flex">
            <ul className="flex gap-3">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className="hover:bg-[#F4F2F1] rounded-md p-3 transition"
                >
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className="text-black font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-3">
            <motion.button
              onClick={handleJoinWaitlist}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg border border-black font-semibold text-black bg-white transition-all duration-300"
            >
              Join Waitlist
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 rounded-lg bg-black text-white font-semibold transition-all duration-300"
            >
              Contact Us
            </motion.button>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default React.memo(DesktopHeader);
