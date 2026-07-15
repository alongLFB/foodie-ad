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
      <section className="hero-section noise-overlay text-center relative overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-40 pb-32 relative z-10 flex flex-col items-center">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
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
              className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
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
              className="text-lg sm:text-xl mb-10 max-w-2xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("heroDesc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center items-center w-full sm:w-auto mt-4"
            >
              {/* Primary CTA: Explore Food */}
              <button
                onClick={() => {
                  document
                    .getElementById("restaurant-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white text-lg flex justify-center items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FF6B6B, #F5A623)",
                }}
              >
                🍜 {t("exploreBtn")}
              </button>

              {/* Secondary CTA: Food Map */}
              <button
                onClick={() => {
                  if (showMap) {
                    document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  } else {
                    setShowMap(true);
                    setTimeout(() => {
                      document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border-2"
                style={{
                  borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                  color: "var(--text-primary)",
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                }}
              >
                🗺️ {t("mapBtn")}
              </button>
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

      <section
        style={{
          background: isDark
            ? "linear-gradient(135deg, #12122A, #1A1A30)"
            : "linear-gradient(135deg, #F5A623, #FF6B6B)",
          padding: "32px 0",
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
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
            id="map-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🗺️</span>
                  <div>
                    <h2
                      className="text-2xl font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {t("mapTitle")}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                      {t("mapDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowMap(false)}
                    className="text-sm px-4 py-1.5 rounded-full font-bold shadow-sm border border-[var(--border-color)] transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    🔼 {t("collapseMap")}
                  </button>
                  <div
                    className="inline-flex text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: isDark ? "rgba(0,212,255,0.1)" : "rgba(245,166,35,0.1)",
                      color: isDark ? "#00D4FF" : "#F5A623",
                      border: `1px solid ${isDark ? "rgba(0,212,255,0.3)" : "rgba(245,166,35,0.3)"}`,
                    }}
                  >
                    {isDark ? t("mapCyberpunk") : t("mapResort")}
                  </div>
                </div>
              </div>
              <FoodieMap restaurants={allRestaurants} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section
        id="restaurant-section"
        className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div>
            <h2
              className="text-4xl font-black mb-2 flex items-center gap-3"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="text-5xl">🏆</span> {t("restaurantsTitle").replace("🏆 ", "")}
            </h2>
            <p className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>
              {t("restaurantsDesc", { count: filteredRestaurants.length })}
            </p>
          </div>
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
        className="mt-16 py-12 text-center"
        style={{
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
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
