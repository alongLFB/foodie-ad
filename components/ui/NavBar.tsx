"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [langZh, setLangZh] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? isDark
            ? "rgba(10, 10, 26, 0.85)"
            : "rgba(255, 248, 240, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid var(--border-color)` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">🍽️</span>
            <div>
              <span
                className="font-black text-xl"
                style={{
                  background: "linear-gradient(135deg, #F5A623, #FF6B6B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Foodie-AD
              </span>
              <div
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {langZh ? "阿布扎比最毒舌美食指南" : "Abu Dhabi's Funniest Food Guide"}
              </div>
            </div>
          </motion.div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <motion.button
              onClick={() => setLangZh(!langZh)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
              style={{
                borderColor: "var(--color-saffron)",
                color: "var(--color-saffron)",
                background: "transparent",
              }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(245, 166, 35, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              {langZh ? "🇺🇸 EN" : "🇨🇳 中文"}
            </motion.button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
