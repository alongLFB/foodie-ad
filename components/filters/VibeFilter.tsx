"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VIBE_OPTIONS, VibeTag } from "@/types";
import { useLocale } from "next-intl";

interface VibeFilterProps {
  selected: VibeTag | null;
  onSelect: (vibe: VibeTag | null) => void;
}

export default function VibeFilter({
  selected,
  onSelect,
}: VibeFilterProps) {
  const locale = useLocale();
  const lang = locale === "zh" ? "zh" : "en";

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🧭</span>
        <h2
          className="font-bold text-xl"
          style={{ color: "var(--text-primary)" }}
        >
          {lang === "zh" ? "现在是什么吃货状态？" : "What's your vibe right now?"}
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* All button */}
        <motion.button
          onClick={() => onSelect(null)}
          className={`vibe-chip ${selected === null ? "active" : ""}`}
          style={{ padding: "10px 20px", fontSize: "15px" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          {lang === "zh" ? "🍽️ 全部" : "🍽️ Show All"}
        </motion.button>

        {/* Vibe chips */}
        <AnimatePresence mode="popLayout">
          {VIBE_OPTIONS.map((vibe) => (
            <motion.button
              key={vibe.id}
              onClick={() =>
                onSelect(selected === vibe.id ? null : vibe.id)
              }
              className={`vibe-chip ${selected === vibe.id ? "active" : ""}`}
              style={{ padding: "10px 20px", fontSize: "15px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              {vibe.emoji}{" "}
              {lang === "zh" ? vibe.labelZh : vibe.labelEn}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Result count hint */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-base font-medium"
            style={{ color: "var(--color-saffron)" }}
          >
            {lang === "zh"
              ? `✨ 已为你筛选"${VIBE_OPTIONS.find((v) => v.id === selected)?.labelZh}"场景`
              : `✨ Filtered to "${VIBE_OPTIONS.find((v) => v.id === selected)?.labelEn}" vibe`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
