"use client";

import { motion } from "framer-motion";

type LoaderType = "burger" | "chopsticks" | "wok";

interface FunLoaderProps {
  type?: LoaderType;
  text?: string;
}

const loaderConfig = {
  burger: {
    emoji: "🍔",
    className: "fun-loader-burger",
    texts: [
      "正在寻找人间美味...",
      "Hunting for deliciousness...",
      "为美食排排队...",
    ],
  },
  chopsticks: {
    emoji: "🥢",
    className: "fun-loader-chopsticks",
    texts: [
      "筷子在飞速旋转中...",
      "Chopsticks spinning at light speed...",
    ],
  },
  wok: {
    emoji: "🍳",
    className: "fun-loader-wok",
    texts: [
      "厨师正在疯狂炒菜...",
      "Chef is frantically wok-tossing...",
    ],
  },
};

export default function FunLoader({ type = "burger", text }: FunLoaderProps) {
  const config = loaderConfig[type];
  const defaultText = config.texts[0];

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className={config.className} aria-label="Loading">
        {config.emoji}
      </div>
      <motion.p
        className="text-base font-medium"
        style={{ color: "var(--text-muted)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text || defaultText}
      </motion.p>
    </div>
  );
}

// Skeleton Burger — for card placeholders
export function BurgerSkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: "var(--border-color)" }}
    >
      {/* Image placeholder */}
      <div className="relative h-48 skeleton flex items-center justify-center">
        <span className="fun-loader-burger text-4xl opacity-40">🍔</span>
      </div>
      {/* Content placeholders */}
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 rounded-lg w-3/4" />
        <div className="skeleton h-4 rounded-lg w-full" />
        <div className="skeleton h-4 rounded-lg w-2/3" />
        <div className="flex gap-2 mt-4">
          <div className="skeleton h-6 rounded-full w-20" />
          <div className="skeleton h-6 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

// Full page fun loader
export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="relative">
        <span className="text-7xl fun-loader-wok">🍳</span>
        <motion.span
          className="absolute -top-4 -right-2 text-2xl"
          animate={{ y: [0, -20, 0], opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        >
          💨
        </motion.span>
        <motion.span
          className="absolute -top-8 right-2 text-lg"
          animate={{ y: [0, -20, 0], opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute -top-6 -left-2 text-xl"
          animate={{ y: [0, -20, 0], opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
        >
          🌶️
        </motion.span>
      </div>
      <div className="text-center">
        <p
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Foodie-AD
        </p>
        <motion.p
          className="text-sm mt-1"
          style={{ color: "var(--text-muted)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          正在为你搜罗阿布扎比的人间美味...
        </motion.p>
      </div>
    </div>
  );
}
