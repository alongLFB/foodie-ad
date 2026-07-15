"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-14 h-7 rounded-full border-2 cursor-pointer"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0A0A1A, #12122A)"
          : "linear-gradient(135deg, #FFF8F0, #FFE8D6)",
        borderColor: isDark ? "#2A2A50" : "#E8E8F0",
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        layout
        className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #00D4FF, #9B59B6)"
            : "linear-gradient(135deg, #F5A623, #FF6B6B)",
        }}
        animate={{ left: isDark ? "calc(100% - 22px)" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? "🌙" : "☀️"}
      </motion.div>
    </motion.button>
  );
}
