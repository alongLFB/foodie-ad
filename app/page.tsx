"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import NavBar from "@/components/ui/NavBar";
import VibeFilter from "@/components/filters/VibeFilter";
import RestaurantGrid from "@/components/restaurants/RestaurantGrid";
import SubmitButton from "@/components/ugc/SubmitButton";
import dynamic from "next/dynamic";
import { getApprovedRestaurants, filterByVibe } from "@/lib/data";
import { VibeTag } from "@/types";

// Dynamic import for map to avoid SSR issues
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

const STATS = [
  { emoji: "🍽️", value: "10+", label: "Reviewed Spots", labelZh: "已收录餐厅" },
  { emoji: "😂", value: "100%", label: "Honest Reviews", labelZh: "真实毒舌" },
  { emoji: "💸", value: "0", label: "Paid Promotions", labelZh: "恰饭软文" },
  { emoji: "🌶️", value: "∞", label: "Spice Level", labelZh: "辣度上限" },
];

export default function HomePage() {
  const [activeVibe, setActiveVibe] = useState<VibeTag | null>(null);
  const [langZh, setLangZh] = useState(false);
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

  const lang = langZh ? "zh" : "en";

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <NavBar />

      {/* ─── HERO SECTION ─────────────────────────────────── */}
      <section className="hero-section noise-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
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
              {lang === "zh"
                ? "阿布扎比最毒舌的美食点评平台"
                : "Abu Dhabi's Most Brutally Honest Food Guide"}
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              {lang === "zh" ? (
                <>
                  在阿布扎比，
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #F5A623, #FF6B6B)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    我们替你踩雷
                  </span>
                </>
              ) : (
                <>
                  Abu Dhabi Food,
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #F5A623, #FF6B6B)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    No BS Reviews
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl mb-10 max-w-2xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {lang === "zh"
                ? "从茅台级奢享到路边摊回魂汤，我们用🔥毒舌+😂幽默，带你发现阿布扎比的真实美食版图。"
                : "From Michelin-star splurges to hidden shawarma gems — brutally honest reviews from real foodies who actually live here."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={() => {
                  document
                    .getElementById("restaurant-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-2xl font-bold text-white text-lg"
                style={{
                  background: "linear-gradient(135deg, #F5A623, #FF6B6B)",
                  boxShadow: "0 8px 32px rgba(245,166,35,0.4)",
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                🍜 {lang === "zh" ? "开始探索" : "Explore Food"}
              </motion.button>

              <motion.button
                onClick={() => setShowMap(!showMap)}
                className="px-8 py-4 rounded-2xl font-bold text-lg border-2"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  background: "var(--bg-card)",
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                🗺️ {lang === "zh" ? "美食地图" : "Food Map"}
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
          padding: "24px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl mb-1">{stat.emoji}</div>
                <div
                  className="text-2xl font-black"
                  style={{ color: isDark ? "#F5A623" : "white" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: isDark ? "var(--text-muted)" : "rgba(255,255,255,0.8)" }}
                >
                  {lang === "zh" ? stat.labelZh : stat.label}
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🗺️</span>
                <div>
                  <h2
                    className="text-2xl font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {lang === "zh" ? "美食地图" : "Food Map"}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {lang === "zh"
                      ? "点击 Emoji 查看餐厅详情"
                      : "Click any emoji to see restaurant details"}
                  </p>
                </div>
                <div
                  className="ml-auto text-xs px-3 py-1 rounded-full"
                  style={{
                    background: isDark ? "rgba(0,212,255,0.1)" : "rgba(245,166,35,0.1)",
                    color: isDark ? "#00D4FF" : "#F5A623",
                    border: `1px solid ${isDark ? "rgba(0,212,255,0.3)" : "rgba(245,166,35,0.3)"}`,
                  }}
                >
                  {isDark ? "🌃 赛博朋克模式" : "🌴 度假风模式"}
                </div>
              </div>
              <FoodieMap restaurants={allRestaurants} lang={lang} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── RESTAURANT SECTION ───────────────────────────── */}
      <section
        id="restaurant-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2
            className="text-3xl font-black mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {lang === "zh" ? "🏆 全部餐厅" : "🏆 All Restaurants"}
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {lang === "zh"
              ? `${filteredRestaurants.length} 家餐厅 · 经毒舌评审团严格测评`
              : `${filteredRestaurants.length} spots · Brutally reviewed by real foodies`}
          </p>
        </motion.div>

        {/* Vibe Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 overflow-x-auto pb-2"
        >
          <VibeFilter
            selected={activeVibe}
            onSelect={setActiveVibe}
            lang={lang}
          />
        </motion.div>

        {/* Restaurant Grid */}
        <RestaurantGrid
          restaurants={filteredRestaurants}
          activeVibe={activeVibe}
          lang={lang}
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
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-3xl mb-3"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          >
            🍽️
          </motion.div>
          <p className="font-black text-xl mb-1" style={{ color: "var(--text-primary)" }}>
            Foodie-AD
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            {lang === "zh"
              ? "用毒舌 + 幽默，记录阿布扎比的每一口惊喜与雷区"
              : "Documenting every bite and disaster in Abu Dhabi, one review at a time"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2025 Foodie-AD · foodie-ad.alonglfb.com · Made with 🍜 in Abu Dhabi
          </p>
        </div>
      </footer>

      {/* Floating Submit Button */}
      <SubmitButton lang={lang} />
    </div>
  );
}
