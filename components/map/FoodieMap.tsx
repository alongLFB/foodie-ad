"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Restaurant, CATEGORY_EMOJI } from "@/types";
import Image from "next/image";

interface FoodieMapProps {
  restaurants: Restaurant[];
  lang?: "en" | "zh";
}

interface PopupState {
  restaurant: Restaurant;
  x: number;
  y: number;
}

const DARK_MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
const LIGHT_MAP_STYLE = "mapbox://styles/mapbox/outdoors-v12";

export default function FoodieMap({ restaurants, lang = "en" }: FoodieMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || token === "your_mapbox_token_here") {
      setMapError(true);
      return;
    }

    let mapboxgl: any;
    try {
      mapboxgl = require("mapbox-gl");
    } catch {
      setMapError(true);
      return;
    }

    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE,
      center: [54.3773, 24.4539],
      zoom: 11.5,
      pitch: 30,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      setMapLoaded(true);

      // Add custom atmosphere in dark mode (cyberpunk effect)
      if (isDark) {
        map.setFog({
          color: "rgb(10, 10, 26)",
          "high-color": "rgb(36, 32, 62)",
          "horizon-blend": 0.05,
          "space-color": "rgb(10, 10, 26)",
          "star-intensity": 0.8,
        });
      }

      // Add restaurant markers
      restaurants.forEach((restaurant) => {
        const el = document.createElement("div");
        el.className = "map-marker";
        el.innerHTML = CATEGORY_EMOJI[restaurant.category];
        el.title = restaurant.name;

        // Special treatment for avoided restaurant
        if (restaurant.rating < 2.5) {
          el.style.filter = "grayscale(50%) drop-shadow(0 4px 6px rgba(231,76,60,0.6))";
        }

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const rect = el.getBoundingClientRect();
          setPopup({
            restaurant,
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([restaurant.lng, restaurant.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    map.on("click", () => setPopup(null));

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
    };
  }, [token]);

  // Update style on theme change
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      mapRef.current.setStyle(isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE);
    }
  }, [isDark, mapLoaded]);

  // Map error / no token placeholder
  if (mapError || !token || token === "your_mapbox_token_here") {
    return (
      <div
        className="relative rounded-3xl overflow-hidden flex items-center justify-center"
        style={{
          height: 420,
          background: isDark
            ? "linear-gradient(135deg, #0A0A1A, #12082A)"
            : "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
          border: "2px dashed var(--border-color)",
        }}
      >
        <div className="text-center p-8">
          <div className="text-5xl mb-4">🗺️</div>
          <p className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
            {lang === "zh" ? "美食地图加载中..." : "Food Map Placeholder"}
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            {lang === "zh"
              ? "请在 .env.local 中配置 NEXT_PUBLIC_MAPBOX_TOKEN"
              : "Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local"}
          </p>
          {/* Show restaurant pins as emoji grid instead */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {restaurants.slice(0, 8).map((r) => (
              <motion.div
                key={r.id}
                className="flex flex-col items-center gap-1 cursor-pointer"
                whileHover={{ scale: 1.2, y: -4 }}
                onClick={() =>
                  setPopup({ restaurant: r, x: window.innerWidth / 2, y: 200 })
                }
              >
                <span className="text-3xl">{CATEGORY_EMOJI[r.category]}</span>
                <span
                  className="text-xs font-medium max-w-16 text-center leading-tight"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {r.area}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popup */}
        <AnimatePresence>
          {popup && (
            <RestaurantPopup
              restaurant={popup.restaurant}
              lang={lang}
              onClose={() => setPopup(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ height: 420 }}>
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading overlay */}
      <AnimatePresence>
        {!mapLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "var(--bg-primary)" }}
          >
            <div className="text-center">
              <span className="fun-loader-wok text-4xl">🍳</span>
              <p
                className="mt-3 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {lang === "zh" ? "地图加载中..." : "Loading map..."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup */}
      <AnimatePresence>
        {popup && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="pointer-events-auto">
              <RestaurantPopup
                restaurant={popup.restaurant}
                lang={lang}
                onClose={() => setPopup(null)}
                fixed
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Restaurant Popup Card ───────────────────────────────────
interface RestaurantPopupProps {
  restaurant: Restaurant;
  lang?: "en" | "zh";
  onClose: () => void;
  fixed?: boolean;
}

function RestaurantPopup({ restaurant, lang, onClose, fixed }: RestaurantPopupProps) {
  const name = lang === "zh" && restaurant.nameZh ? restaurant.nameZh : restaurant.name;
  const quote =
    lang === "zh" && restaurant.funnyQuoteZh
      ? restaurant.funnyQuoteZh
      : restaurant.funnyQuote;

  return (
    <motion.div
      className={fixed ? "fixed inset-0 z-50 flex items-center justify-center p-4" : ""}
      style={fixed ? { background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" } : {}}
      onClick={fixed ? onClose : undefined}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="rounded-2xl overflow-hidden w-72 shadow-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-36">
          <Image
            src={restaurant.coverImage}
            alt={name}
            fill
            className="object-cover"
            sizes="288px"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
          >
            ✕
          </button>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(245,166,35,0.95)", color: "white" }}>
            ⭐ {restaurant.rating.toFixed(1)}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
            {CATEGORY_EMOJI[restaurant.category]} {name}
          </p>
          <p className="text-xs italic mb-2" style={{ color: "var(--text-secondary)" }}>
            "{quote.slice(0, 80)}{quote.length > 80 ? "..." : ""}"
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            📍 {restaurant.address}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
