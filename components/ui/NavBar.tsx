"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function NavBar() {
  const t = useTranslations("NavBar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

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
      <div 
        className="w-full mx-auto"
        style={{ padding: '0 40px' }}
      >
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-3xl">🍽️</span>
            <div>
              <span
                className="font-black text-2xl tracking-tight"
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
                className="text-xs font-medium tracking-wide mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {t("subtitle")}
              </div>
            </div>
          </motion.div>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLocale}
              className="rounded-full text-sm font-bold border-2 transition-all"
              style={{
                padding: '10px 20px',
                borderColor: "var(--color-saffron)",
                color: "var(--color-saffron)",
                background: "transparent",
              }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(245, 166, 35, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              {locale === "en" ? "🇨🇳 中文" : "🇺🇸 EN"}
            </motion.button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
