"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Restaurant, CATEGORY_EMOJI } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

const PRICE_LABELS = ["", "💰 Budget", "💰💰 Mid", "💰💰💰 Pricey", "💰💰💰💰 Splurge"];

export function RestaurantCard({
  restaurant,
  index = 0,
}: RestaurantCardProps) {
  const t = useTranslations("Card");
  const locale = useLocale();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isAvoid = restaurant.rating < 2.5;

  const name = locale === "zh" && restaurant.nameZh ? restaurant.nameZh : restaurant.name;
  const quote = locale === "zh" && restaurant.funnyQuoteZh ? restaurant.funnyQuoteZh : restaurant.funnyQuote;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `https://foodie-ad.alonglfb.com/restaurants/${restaurant.id}`;
    const text = locale === "zh"
        ? `如果你不请我吃这家店，我们就绝交吧！👇 ${shareUrl}`
        : `If you don't take me here, we're done! 👇 ${shareUrl}`;

    if (navigator.share) {
      navigator.share({ title: name, text, url: shareUrl });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <motion.article
      className={`restaurant-card ${isAvoid ? "avoid-card" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image section */}
      <div className="relative h-56 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton flex items-center justify-center">
            <span className="fun-loader-chopsticks text-3xl opacity-40">🥢</span>
          </div>
        )}
        <Image
          src={restaurant.coverImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <motion.div
            className="px-3 py-1.5 rounded-full text-sm font-bold shadow-lg"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              color: "white",
            }}
          >
            {CATEGORY_EMOJI[restaurant.category]} {restaurant.area}
          </motion.div>
        </div>

        {/* Avoid badge */}
        {isAvoid && (
          <motion.div
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-black shadow-lg"
            style={{ background: "#E74C3C", color: "white" }}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⚠️ {t("avoid").toUpperCase()}
          </motion.div>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-4 right-4">
          <div
            className="px-3 py-1.5 rounded-lg text-base font-black shadow-lg"
            style={{
              background: isAvoid
                ? "rgba(231, 76, 60, 0.95)"
                : "rgba(245, 166, 35, 0.95)",
              color: "white",
            }}
          >
            ⭐ {restaurant.rating.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="font-bold text-xl mb-2 line-clamp-1"
          style={{ color: "var(--text-primary)" }}
        >
          {name}
        </h3>

        {/* Funny Quote */}
        <div
          className="text-sm italic mb-4 line-clamp-2 rounded-xl p-3"
          style={{
            background: "rgba(245, 166, 35, 0.08)",
            color: "var(--text-secondary)",
            borderLeft: "4px solid var(--color-saffron)",
          }}
        >
          "{quote}"
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            {/* Price */}
            <span
              className={`text-sm font-semibold price-${restaurant.priceLevel}`}
            >
              {PRICE_LABELS[restaurant.priceLevel]}
            </span>

            {/* Funny score */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                😂×{restaurant.funnyScore}
              </span>
            </div>
          </div>

          {/* Share button */}
          <motion.button
            onClick={handleShare}
            className="text-xs px-4 py-2 rounded-full font-bold shadow-md"
            style={{
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              color: "white",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📤 Share
          </motion.button>
        </div>

        {/* Vibe tags */}
        {restaurant.vibes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px dashed var(--border-color)" }}>
            {restaurant.vibes.slice(0, 3).map((vibe) => (
              <span
                key={vibe}
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-color)"
                }}
              >
                {vibe.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
