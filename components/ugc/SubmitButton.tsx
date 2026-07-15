"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubmitForm from "./SubmitForm";

interface SubmitButtonProps {
  lang?: "en" | "zh";
}

export default function SubmitButton({ lang = "en" }: SubmitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="floating-btn"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={lang === "zh" ? "我要爆料" : "Submit a spot"}
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          📝
        </motion.span>
        {lang === "zh" ? "我要爆料！" : "Submit a Spot!"}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SubmitForm onClose={() => setIsOpen(false)} lang={lang} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
