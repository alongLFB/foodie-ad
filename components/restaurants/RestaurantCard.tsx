"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Restaurant, CATEGORY_EMOJI, VIBE_OPTIONS } from "@/types";
import RestaurantModal from "./RestaurantModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAvoid = restaurant.rating < 2.5;

  const name = locale === "zh" && restaurant.nameZh ? restaurant.nameZh : restaurant.name;
  const quote = locale === "zh" && restaurant.funnyQuoteZh ? restaurant.funnyQuoteZh : restaurant.funnyQuote;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
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
      onClick={() => setIsModalOpen(true)}
    >
      <div 
        className="relative h-64 overflow-hidden" 
        style={{ margin: '16px 16px 0 16px', borderRadius: '20px' }}
      >
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
        <div className="absolute z-10" style={{ top: '16px', left: '16px' }}>
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
            className="absolute z-10 px-3 py-1.5 rounded-full text-xs font-black shadow-lg"
            style={{ top: '16px', right: '16px', background: "#E74C3C", color: "white" }}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⚠️ {t("avoid").toUpperCase()}
          </motion.div>
        )}

        {/* Rating overlay */}
        <div className="absolute z-10" style={{ bottom: '16px', right: '16px' }}>
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

      {/* Content Area Container */}
      <div 
        className="flex flex-col relative" 
        style={{ padding: '16px 20px 24px 20px', gap: '12px' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <h3
            className="font-bold text-2xl line-clamp-1"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </h3>
          {restaurant.submittedBy ? (
            <span 
              className="text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap shrink-0"
              style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" }}
            >
              👤 {t("ugc")}
            </span>
          ) : (
            <span 
              className="text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap shrink-0"
              style={{ background: "rgba(245, 166, 35, 0.1)", color: "#F5A623", border: "1px solid rgba(245, 166, 35, 0.2)" }}
            >
              🌟 {t("official")}
            </span>
          )}
        </div>

        {/* Funny Quote */}
        <div
          className="text-sm italic line-clamp-2 rounded-r-md pl-3 py-1"
          style={{
            background: "rgba(245, 166, 35, 0.08)",
            color: "var(--text-secondary)",
            borderLeft: "4px solid var(--color-saffron)",
          }}
        >
          "{quote}"
        </div>

        {/* Meta row */}
        <div className="flex justify-between items-center w-full mt-1">
          <div className="flex items-center gap-3">
            {/* Price */}
            <span
              className={`text-sm font-bold price-${restaurant.priceLevel}`}
            >
              {PRICE_LABELS[restaurant.priceLevel]}
            </span>

            {/* Funny score */}
            <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              😂×{restaurant.funnyScore}
            </span>
          </div>

          {/* Share button */}
          <motion.button
            onClick={handleShare}
            className="text-xs rounded-full font-bold shadow-sm z-10 shrink-0"
            style={{
              padding: '8px 16px',
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
          <div 
            className="flex flex-wrap" 
            style={{ 
              borderTop: "1px dashed var(--border-color)", 
              marginTop: '16px', 
              paddingTop: '16px', 
              gap: '8px' 
            }}
          >
            {restaurant.vibes.slice(0, 3).map((vibe) => {
              const vObj = VIBE_OPTIONS.find(v => v.id === vibe);
              const vText = vObj ? (locale === "zh" ? `${vObj.emoji} ${vObj.labelZh}` : `${vObj.emoji} ${vObj.labelEn}`) : vibe.replace(/-/g, " ");
              return (
                <span
                  key={vibe}
                  className="text-xs font-medium rounded-full"
                  style={{
                    padding: '6px 14px',
                    background: "var(--bg-secondary)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  {vText}
                </span>
              );
            })}
          </div>
        )}

        {/* Must Order Highlight */}
        {restaurant.mustOrder && (
          <div 
            className="mt-3 text-sm rounded-lg"
            style={{
              padding: '10px 14px',
              background: 'rgba(245, 166, 35, 0.1)',
              borderLeft: '4px solid #F5A623',
              color: 'var(--text-primary)'
            }}
          >
            <span className="font-bold">🔥 {locale === "zh" ? "必点推荐：" : "Must Order: "}</span>
            {restaurant.mustOrder}
          </div>
        )}
      </div>
    </motion.article>
    <RestaurantModal 
      restaurant={restaurant} 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
    </>
  );
}
