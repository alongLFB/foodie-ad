"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VIBE_OPTIONS, VibeTag } from "@/types";
import { useLocale, useTranslations } from "next-intl";

interface VibeFilterProps {
  selected: VibeTag | null;
  onSelect: (vibe: VibeTag | null) => void;
}

export default function VibeFilter({
  selected,
  onSelect,
}: VibeFilterProps) {
  const locale = useLocale();
  const t = useTranslations("VibeFilter");

  return (
    <div className="w-full">
      <div style={{ marginBottom: '16px' }}>
        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {t("title")}
        </span>
      </div>

      <div className="flex flex-wrap" style={{ gap: '16px' }}>
        {/* All button */}
        <motion.button
          onClick={() => onSelect(null)}
          className={`vibe-chip ${selected === null ? "active" : ""}`}
          style={{ padding: "10px 20px", fontSize: "15px" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          {t("all")}
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
              {vibe.emoji} {locale === "zh" ? vibe.labelZh : vibe.labelEn}
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
            {t("filteredPrefix")}{locale === "zh" ? VIBE_OPTIONS.find((v) => v.id === selected)?.labelZh : VIBE_OPTIONS.find((v) => v.id === selected)?.labelEn}{t("filteredSuffix")}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
