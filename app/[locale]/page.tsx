"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import NavBar from "@/components/ui/NavBar";
import VibeFilter from "@/components/filters/VibeFilter";
import RestaurantGrid from "@/components/restaurants/RestaurantGrid";
import SubmitButton from "@/components/ugc/SubmitButton";
import dynamic from "next/dynamic";
import { getApprovedRestaurants, filterByVibe } from "@/lib/data";
import { VibeTag } from "@/types";

const FoodieMap = dynamic(() => import("@/components/map/FoodieMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-3xl flex items-center justify-center"
      style={{ height: 420, background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <div className="text-center">
        <span className="fun-loader-wok text-4xl">🍳</span>
        <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
          Loading map...
        </p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const t = useTranslations("Index");
  const [activeVibe, setActiveVibe] = useState<VibeTag | null>(null);
  const [showMap, setShowMap] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const allRestaurants = getApprovedRestaurants();
  const filteredRestaurants = useMemo(
    () => filterByVibe(allRestaurants, activeVibe),
    [activeVibe, allRestaurants]
  );

  const STATS = [
    { emoji: "🍽️", value: "10+", label: t("statsSpots") },
    { emoji: "😂", value: "100%", label: t("statsHonest") },
    { emoji: "💸", value: "0", label: t("statsPaid") },
    { emoji: "🌶️", value: "∞", label: t("statsSpice") },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <NavBar />

      {/* ─── HERO SECTION ─────────────────────────────────── */}
      <section className="hero-section noise-overlay">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-24 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
              style={{
                background: isDark
                  ? "rgba(0,212,255,0.1)"
                  : "rgba(245,166,35,0.12)",
                border: `1px solid ${isDark ? "rgba(0,212,255,0.3)" : "rgba(245,166,35,0.3)"}`,
                color: isDark ? "#00D4FF" : "#F5A623",
              }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                🍔
              </motion.span>
              {t("heroEyebrow")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8"
              style={{ color: "var(--text-primary)" }}
            >
              {t("heroTitle1")}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #F5A623, #FF6B6B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("heroTitle2")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl mb-12 max-w-2xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("heroDesc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <motion.button
                onClick={() => {
                  document
                    .getElementById("restaurant-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-10 py-5 rounded-2xl font-bold text-white text-lg"
                style={{
                  background: "linear-gradient(135deg, #F5A623, #FF6B6B)",
                  boxShadow: "0 8px 32px rgba(245,166,35,0.4)",
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                🍜 {t("exploreBtn")}
              </motion.button>

              <motion.button
                onClick={() => setShowMap(!showMap)}
                className="px-10 py-5 rounded-2xl font-bold text-lg border-2"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  background: "var(--bg-card)",
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                🗺️ {t("mapBtn")}
              </motion.button>
            </motion.div>
          </div>

          {/* Floating food emojis */}
          {["🍜", "🍔", "🫕", "🍣", "🥗", "🍛", "☕", "🧁"].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl select-none pointer-events-none hidden lg:block"
              style={{
                right: `${5 + (i % 4) * 12}%`,
                top: `${20 + Math.floor(i / 4) * 35}%`,
                opacity: 0.15 + (i % 3) * 0.08,
              }}
              animate={{
                y: [0, -12, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────── */}
      <section
        style={{
          background: isDark
            ? "linear-gradient(135deg, #12122A, #1A1A30)"
            : "linear-gradient(135deg, #F5A623, #FF6B6B)",
          padding: "32px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <div
                  className="text-3xl font-black"
                  style={{ color: isDark ? "#F5A623" : "white" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-base font-medium mt-1"
                  style={{ color: isDark ? "var(--text-muted)" : "rgba(255,255,255,0.8)" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAP SECTION ──────────────────────────────────── */}
      <AnimatePresence>
        {showMap && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl">🗺️</span>
                <div>
                  <h2
                    className="text-3xl font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t("mapTitle")}
                  </h2>
                  <p className="text-base mt-1" style={{ color: "var(--text-muted)" }}>
                    {t("mapDesc")}
                  </p>
                </div>
                <div
                  className="ml-auto text-sm px-4 py-2 rounded-full font-medium"
                  style={{
                    background: isDark ? "rgba(0,212,255,0.1)" : "rgba(245,166,35,0.1)",
                    color: isDark ? "#00D4FF" : "#F5A623",
                    border: `1px solid ${isDark ? "rgba(0,212,255,0.3)" : "rgba(245,166,35,0.3)"}`,
                  }}
                >
                  {isDark ? t("mapCyberpunk") : t("mapResort")}
                </div>
              </div>
              <FoodieMap restaurants={allRestaurants} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── RESTAURANT SECTION ───────────────────────────── */}
      <section
        id="restaurant-section"
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2
            className="text-4xl font-black mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {t("restaurantsTitle")}
          </h2>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            {t("restaurantsDesc", { count: filteredRestaurants.length })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 overflow-x-auto pb-4"
        >
          <VibeFilter
            selected={activeVibe}
            onSelect={setActiveVibe}
          />
        </motion.div>

        <RestaurantGrid
          restaurants={filteredRestaurants}
          activeVibe={activeVibe}
        />
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer
        className="mt-20 py-16 text-center"
        style={{
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            className="text-4xl mb-4"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          >
            🍽️
          </motion.div>
          <p className="font-black text-2xl mb-2" style={{ color: "var(--text-primary)" }}>
            Foodie-AD
          </p>
          <p className="text-base mb-6" style={{ color: "var(--text-muted)" }}>
            {t("footerDesc")}
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {t("footerCopyright")}
          </p>
        </div>
      </footer>

      <SubmitButton />
    </div>
  );
}
