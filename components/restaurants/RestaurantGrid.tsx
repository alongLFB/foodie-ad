"use client";

import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { Restaurant, VibeTag } from "@/types";
import { RestaurantCard } from "./RestaurantCard";
import { BurgerSkeletonCard } from "@/components/loaders/FunLoader";

interface RestaurantGridProps {
  restaurants: Restaurant[];
  loading?: boolean;
  activeVibe?: VibeTag | null;
  lang?: "en" | "zh";
}

export default function RestaurantGrid({
  restaurants,
  loading = false,
  activeVibe,
  lang = "en",
}: RestaurantGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <BurgerSkeletonCard />
          </motion.div>
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <span className="text-6xl">😭</span>
        <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          {lang === "zh" ? "这个场景下没有找到餐厅" : "No restaurants for this vibe"}
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {lang === "zh"
            ? "换个心情试试？或者你来爆料一家！"
            : "Try another vibe or be the first to submit one!"}
        </p>
      </motion.div>
    );
  }

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              lang={lang}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
