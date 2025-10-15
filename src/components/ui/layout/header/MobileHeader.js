"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

const MobileHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest(".mobile-menu-container")) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleInstantScrollTop = useCallback((e) => {
    e.preventDefault();
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0 });
    window.history.replaceState(null, "", window.location.pathname);
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 50);
    setIsMenuOpen(false);
  }, []);

  const handleJoinWaitlist = useCallback(() => {
    router.push("/signup");
    setIsMenuOpen(false);
  }, [router]);

  const handleMenuLinkClick = useCallback((e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  }, []);

  const navItems = [
    { href: "#home", label: "Home", onClick: handleInstantScrollTop },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
    { href: "#comparison", label: "Comparison" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="w-full bg-gradient-to-r from-[#D584D5] via-[#E9E1DF] to-[#EDC8BE]">
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div
            className={`flex items-center justify-between px-6 transition-all duration-300 ${
              isScrolled ? "py-3" : "py-4"
            } mobile-menu-container`}
          >
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <span className={isScrolled ? "text-lg" : "text-xl"}>
                HelpBase
              </span>
            </div>

            <button
              className="md:hidden text-white bg-black p-3 rounded-lg transition-transform active:scale-95"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 z-40 md:hidden"
                  onClick={() => setIsMenuOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="fixed top-24 right-6 w-[80vw] max-w-sm md:hidden bg-white rounded-2xl shadow-xl p-6 z-50 border border-gray-200 mobile-menu-container"
                >
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) =>
                          item.onClick
                            ? item.onClick(e)
                            : handleMenuLinkClick(e, item.href)
                        }
                        className="block py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-semibold text-gray-900"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>

                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      onClick={handleJoinWaitlist}
                      className="w-full py-3 px-4 rounded-lg border-2 border-black font-semibold text-black bg-white hover:bg-gray-50 active:bg-gray-100 transition-all"
                    >
                      Join Waitlist
                    </button>
                    <button className="w-full py-3 px-4 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-all">
                      Contact Us
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default React.memo(MobileHeader);
