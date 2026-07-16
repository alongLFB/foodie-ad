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
import { filterByVibe } from "@/lib/data";
import { VibeTag, Restaurant } from "@/types";

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
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.restaurants) {
          setAllRestaurants(data.restaurants);
        }
      })
      .catch((err) => console.error("Failed to load restaurants:", err))
      .finally(() => setIsLoadingRestaurants(false));
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

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
        <div 
          className="w-full mx-auto relative z-10 flex flex-col items-center"
          style={{ padding: '160px 40px 128px 40px' }}
        >
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                marginBottom: '32px',
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
              className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight"
              style={{ color: "var(--text-primary)", marginBottom: '24px' }}
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
              className="text-lg sm:text-xl max-w-2xl leading-relaxed"
              style={{ color: "var(--text-secondary)", marginBottom: '40px' }}
            >
              {t("heroDesc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row w-full justify-center"
              style={{ marginTop: '48px', paddingTop: '16px', gap: '24px' }}
            >
              {/* Primary CTA: Explore Food */}
              <button
                onClick={() => {
                  document
                    .getElementById("restaurant-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto rounded-2xl font-bold text-lg flex justify-center items-center shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  padding: '16px 32px',
                  gap: '8px',
                  background: "linear-gradient(135deg, #FF6B6B, #F5A623)",
                  color: "white",
                }}
              >
                <span>🚀</span> {t("exploreBtn")}
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
                className="w-full sm:w-auto rounded-2xl font-bold text-lg flex justify-center items-center transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border-2"
                style={{
                  padding: '16px 32px',
                  gap: '8px',
                  background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.6)",
                  backdropFilter: "blur(12px)",
                  color: "var(--text-primary)",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                }}
              >
                <span>🗺️</span> {t("mapBtn")}
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
        <div 
          className="w-full mx-auto"
          style={{ paddingLeft: '40px', paddingRight: '40px' }}
        >
          <div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
            style={{ gap: '32px' }}
          >
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
            <div 
              className="w-full mx-auto"
              style={{ padding: '40px' }}
            >
              <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between"
                style={{ marginBottom: '24px', gap: '16px' }}
              >
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
                    className="text-sm rounded-full font-bold shadow-sm border border-[var(--border-color)] transition-all hover:scale-105 active:scale-95"
                    style={{
                      padding: '8px 20px',
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    🔼 {t("collapseMap")}
                  </button>
                  <div
                    className="inline-flex text-xs rounded-full font-medium"
                    style={{
                      padding: '6px 16px',
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
        className="w-full mx-auto"
        style={{ padding: '80px 40px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between"
          style={{ 
            marginBottom: '32px', 
            paddingBottom: '24px', 
            borderBottom: "1px solid var(--border-color)",
            gap: '16px'
          }}
        >
          <div>
            <h2
              className="text-4xl font-black flex items-center gap-3"
              style={{ color: "var(--text-primary)", marginBottom: '8px' }}
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
          className="overflow-x-auto"
        >
          <div style={{ marginBottom: '40px' }}>
            <VibeFilter
              selected={activeVibe}
              onSelect={setActiveVibe}
            />
          </div>
        </motion.div>

        <RestaurantGrid
          restaurants={filteredRestaurants}
          activeVibe={activeVibe}
        />
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer
        className="text-center"
        style={{
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          padding: '80px 0 60px 0',
          marginTop: '64px',
        }}
      >
        <div 
          className="w-full mx-auto"
          style={{ paddingLeft: '40px', paddingRight: '40px' }}
        >
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
