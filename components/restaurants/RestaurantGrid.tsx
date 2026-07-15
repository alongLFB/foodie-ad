"use client";

import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { useTranslations } from "next-intl";
import { Restaurant, VibeTag } from "@/types";
import { RestaurantCard } from "./RestaurantCard";
import { BurgerSkeletonCard } from "@/components/loaders/FunLoader";

interface RestaurantGridProps {
  restaurants: Restaurant[];
  loading?: boolean;
  activeVibe?: VibeTag | null;
}

export default function RestaurantGrid({
  restaurants,
  loading = false,
  activeVibe,
}: RestaurantGridProps) {
  const t = useTranslations("Grid");

  if (loading) {
    return (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10"
        style={{ gap: '32px' }}
      >
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
        style={{ padding: '80px 0', gap: '16px' }}
      >
        <span className="text-6xl">😭</span>
        <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {t("noResults")}
        </p>
        <p className="text-base" style={{ color: "var(--text-muted)" }}>
          {t("tryAnother")}
        </p>
      </motion.div>
    );
  }

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10"
        style={{ gap: '32px' }}
      >
        <AnimatePresence mode="popLayout">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
