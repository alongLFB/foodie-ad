"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Restaurant, CATEGORY_EMOJI } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  lang?: "en" | "zh";
  index?: number;
}

const PRICE_LABELS = ["", "💰 Budget", "💰💰 Mid", "💰💰💰 Pricey", "💰💰💰💰 Splurge"];

export function RestaurantCard({
  restaurant,
  lang = "en",
  index = 0,
}: RestaurantCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isAvoid = restaurant.rating < 2.5;

  const name = lang === "zh" && restaurant.nameZh ? restaurant.nameZh : restaurant.name;
  const quote =
    lang === "zh" && restaurant.funnyQuoteZh
      ? restaurant.funnyQuoteZh
      : restaurant.funnyQuote;

  const shareOgUrl = `/api/og?id=${restaurant.id}`;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `https://foodie-ad.alonglfb.com/restaurants/${restaurant.id}`;
    const text =
      lang === "zh"
        ? `如果你不请我吃这家店，我们就绝交吧！👇 ${shareUrl}`
        : `If you don't take me here, we're done! 👇 ${shareUrl}`;

    if (navigator.share) {
      navigator.share({ title: name, text, url: shareUrl });
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank"
      );
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
      <div className="relative h-48 overflow-hidden">
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
        <div className="absolute top-3 left-3">
          <motion.div
            className="px-2 py-1 rounded-full text-sm font-bold"
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
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-black"
            style={{ background: "#E74C3C", color: "white" }}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⚠️ AVOID
          </motion.div>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-3 right-3">
          <div
            className="px-2 py-1 rounded-lg text-sm font-black"
            style={{
              background: isAvoid
                ? "rgba(231, 76, 60, 0.9)"
                : "rgba(245, 166, 35, 0.95)",
              color: "white",
            }}
          >
            ⭐ {restaurant.rating.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-bold text-lg mb-1 line-clamp-1"
          style={{ color: "var(--text-primary)" }}
        >
          {name}
        </h3>

        {/* Funny Quote */}
        <div
          className="text-sm italic mb-3 line-clamp-2 rounded-lg p-2"
          style={{
            background: "rgba(245, 166, 35, 0.08)",
            color: "var(--text-secondary)",
            borderLeft: "3px solid var(--color-saffron)",
          }}
        >
          "{quote}"
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {/* Price */}
            <span
              className={`text-xs font-semibold price-${restaurant.priceLevel}`}
            >
              {PRICE_LABELS[restaurant.priceLevel]}
            </span>

            {/* Funny score */}
            <div className="flex items-center gap-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                😂×{restaurant.funnyScore}
              </span>
            </div>
          </div>

          {/* Share button */}
          <motion.button
            onClick={handleShare}
            className="text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              color: "white",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={lang === "zh" ? "分享到WhatsApp" : "Share on WhatsApp"}
          >
            📤 Share
          </motion.button>
        </div>

        {/* Vibe tags */}
        {restaurant.vibes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {restaurant.vibes.slice(0, 3).map((vibe) => (
              <span
                key={vibe}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--border-color)",
                  color: "var(--text-muted)",
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
