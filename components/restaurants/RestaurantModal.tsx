"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Restaurant, CATEGORY_EMOJI } from "@/types";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as htmlToImage from "html-to-image";

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRICE_LABELS = ["", "💰 Budget", "💰💰 Mid", "💰💰💰 Pricey", "💰💰💰💰 Splurge"];

export default function RestaurantModal({ restaurant, isOpen, onClose }: RestaurantModalProps) {
  const t = useTranslations("Card");
  const locale = useLocale();
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!restaurant || !mounted) return null;

  const isAvoid = restaurant.rating < 2.5;
  const name = locale === "zh" && restaurant.nameZh ? restaurant.nameZh : restaurant.name;
  const quote = locale === "zh" && restaurant.funnyQuoteZh ? restaurant.funnyQuoteZh : restaurant.funnyQuote;
  const desc = locale === "zh" && restaurant.descriptionZh ? restaurant.descriptionZh : restaurant.description;

  const handleShare = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(posterRef.current, { cacheBust: true, pixelRatio: 2 });
      
      if (navigator.share && navigator.canShare) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], `${restaurant.name}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: name,
              text: quote,
              files: [file]
            });
            setIsGenerating(false);
            return;
          }
        } catch (e) {
          console.log("Native share failed, falling back to download");
        }
      }

      const link = document.createElement('a');
      link.download = `foodie-ad-${restaurant.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[var(--bg-card)] rounded-[32px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header Image */}
            <div 
              className="relative h-64 sm:h-80 shrink-0"
              style={{ margin: '24px 24px 0 24px', borderRadius: '24px', overflow: 'hidden' }}
            >
              <Image
                src={restaurant.coverImage}
                alt={name}
                fill
                className="object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-20"
              >
                ✕
              </button>
              
              <div className="absolute flex" style={{ top: '16px', left: '16px', gap: '8px' }}>
                <div 
                  className="rounded-full text-sm font-bold bg-black/60 backdrop-blur-md text-white"
                  style={{ padding: '8px 16px' }}
                >
                  {CATEGORY_EMOJI[restaurant.category]} {restaurant.area}
                </div>
                {isAvoid && (
                  <div 
                    className="rounded-full text-xs font-black bg-[#E74C3C] text-white"
                    style={{ padding: '8px 16px' }}
                  >
                    ⚠️ {t("avoid").toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto" style={{ padding: '24px 32px 32px 32px' }}>
              <div className="flex justify-between items-start gap-4 mb-4">
                <h2 className="text-3xl font-black text-[var(--text-primary)] leading-tight">
                  {name}
                </h2>
                <div
                  className="shrink-0 rounded-xl text-lg font-black"
                  style={{
                    padding: '8px 16px',
                    background: isAvoid ? "rgba(231, 76, 60, 0.1)" : "rgba(245, 166, 35, 0.1)",
                    color: isAvoid ? "#E74C3C" : "#F5A623",
                  }}
                >
                  ⭐ {restaurant.rating.toFixed(1)}
                </div>
              </div>

              {/* Quotes & Vibes */}
              <div
                className="text-lg italic mb-6 rounded-2xl"
                style={{
                  padding: '16px 20px',
                  background: "rgba(245, 166, 35, 0.08)",
                  color: "var(--text-secondary)",
                  borderLeft: "4px solid var(--color-saffron)",
                }}
              >
                "{quote}"
              </div>

              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                <span className={`font-semibold price-${restaurant.priceLevel}`}>
                  {PRICE_LABELS[restaurant.priceLevel]}
                </span>
                <span className="font-medium">😂 毒舌指数 ×{restaurant.funnyScore}</span>
              </div>

              {/* Info section */}
              <div className="space-y-4 mb-8">
                <p className="text-lg leading-relaxed text-[var(--text-primary)]">
                  {desc}
                </p>
                
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 mt-6 space-y-3 text-[var(--text-secondary)]">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">🕒</span>
                    <span>{restaurant.hours}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">📞</span>
                    <span>{restaurant.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">📍</span>
                    <a href={restaurant.googleMapsUrl} target="_blank" rel="noreferrer" className="text-[var(--color-saffron)] hover:underline">
                      {restaurant.address}
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={handleShare}
                disabled={isGenerating}
                className="w-full rounded-2xl font-bold text-white text-lg flex items-center justify-center shadow-lg disabled:opacity-70 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  padding: '16px 24px',
                  gap: '8px',
                  background: "linear-gradient(135deg, #F5A623, #FF6B6B)" 
                }}
              >
                {isGenerating ? "生成中..." : "📸 导出分享海报"}
              </button>
            </div>
            
            {/* Hidden Poster Element for html-to-image */}
            <div className="absolute -left-[9999px] top-0">
              <div 
                ref={posterRef} 
                className="w-[800px] bg-white rounded-[32px] overflow-hidden"
                style={{ fontFamily: "'Outfit', 'Noto Sans SC', sans-serif" }}
              >
                <div className="relative h-[500px] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={restaurant.coverImage} alt={name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10 text-white">
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-[#F5A623] mb-4 shadow-lg">
                      {CATEGORY_EMOJI[restaurant.category]} {restaurant.area}
                    </div>
                    <h1 className="text-5xl font-black mb-4 leading-tight">{name}</h1>
                    <div className="flex gap-4 items-center text-xl">
                      <span className="text-[#F5A623] font-bold">⭐ {restaurant.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{PRICE_LABELS[restaurant.priceLevel]}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-10 bg-white">
                  <div className="text-2xl italic text-gray-700 mb-8 border-l-8 border-[#F5A623] pl-6 py-2 bg-orange-50 rounded-r-2xl">
                    "{quote}"
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 text-gray-600 text-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🕒</span> {restaurant.hours}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📞</span> {restaurant.phone}
                    </div>
                    <div className="flex items-center gap-3 col-span-2 mt-2">
                      <span className="text-2xl">📍</span> {restaurant.address}
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-[#F5A623] font-black text-2xl flex items-center gap-2">
                      <span className="text-3xl">🍽️</span> Foodie-AD
                    </div>
                    <div className="text-gray-400 text-sm">阿布扎比最毒舌美食指南</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
