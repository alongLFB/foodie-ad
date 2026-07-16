"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";

export default function AdminPage() {
  const t = useTranslations("AdminPage");
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingItems, setPendingItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const checkAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "foodie2025";
    if (secret === expectedSecret) {
      setIsAuthenticated(true);
      fetchPendingItems();
    } else {
      alert(t("invalidSecret"));
    }
  };

  const fetchPendingItems = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert(t("fetchError"));
    } else {
      setPendingItems(data as any);
    }
    setLoading(false);
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/approve?secret=${secret}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (!res.ok) {
        throw new Error("Action failed");
      }

      setPendingItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert(t("actionError"));
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--bg-primary)" }}
      >
        <form 
          onSubmit={checkAuth} 
          className="w-full max-w-md p-10 rounded-[2rem] shadow-xl text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl mb-6"
          >
            🔐
          </motion.div>
          <h1 
            className="text-3xl font-black mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {t("loginTitle")}
          </h1>
          <p 
            className="text-base mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("loginDesc")}
          </p>
          
          <div className="mb-6 text-left">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="form-input w-full"
              placeholder={t("passwordPlaceholder")}
            />
          </div>
          
          <motion.button
            type="submit"
            className="w-full rounded-xl font-bold text-white flex items-center justify-center gap-2"
            style={{
              padding: '16px 24px',
              background: "linear-gradient(135deg, #F5A623, #FF6B6B)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("loginBtn")}
          </motion.button>
        </form>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">{t("dashboardTitle")}</h1>
          <button
            onClick={fetchPendingItems}
            className="px-4 py-2 rounded-lg font-bold transition-all"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
          >
            {t("refreshBtn")}
          </button>
        </div>

        {loading ? (
          <p className="text-center" style={{ color: "var(--text-muted)" }}>{t("loading")}</p>
        ) : pendingItems.length === 0 ? (
          <p className="text-center p-8 rounded-xl" style={{ color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            {t("empty")}
          </p>
        ) : (
          <div className="grid gap-6">
            {pendingItems.map((item) => (
              <div key={item.id} className="p-6 rounded-xl shadow-md transition-all" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      {item.name} <span className="text-sm font-normal text-gray-500">{t("by")} {item.submittedBy || (item as any).submitted_by}</span>
                    </h2>
                    <p className="mb-2"><strong>{t("review")}</strong> {item.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>{t("address")}</strong> {item.address} ({item.area})<br />
                      <strong>{t("category")}</strong> {item.category}<br />
                      <strong>{t("vibes")}</strong> {(item.vibes || []).join(", ")}<br />
                      <strong>{t("funnyScore")}</strong> {item.funnyScore || (item as any).funny_score}/5
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      disabled={actionLoading === item.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? "..." : t("approveBtn")}
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "reject")}
                      disabled={actionLoading === item.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? "..." : t("rejectBtn")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
