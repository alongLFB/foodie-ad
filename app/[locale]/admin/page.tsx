"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Restaurant } from "@/types";
import styles from "./admin.module.css";
import AdminRestaurantForm from "@/components/admin/AdminRestaurantForm";
import { createPortal } from "react-dom";

export default function AdminPage() {
  const t = useTranslations("AdminPage");
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Tabs & Search
  const [activeTab, setActiveTab] = useState<"pending" | "manage">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit/Create Modal State
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const checkAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "admin";
    if (secret === expectedSecret) {
      setIsAuthenticated(true);
      fetchAllItems();
    } else {
      alert(t("invalidSecret"));
    }
  };

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/restaurants?secret=${secret}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data.restaurants || []);
    } catch (err) {
      console.error(err);
      alert(t("fetchError"));
    }
    setLoading(false);
  };

  // Keep existing quick approve/reject for pending items
  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/approve?secret=${secret}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (!res.ok) throw new Error("Action failed");
      
      if (action === "approve") {
        setItems(prev => prev.map(item => item.id === id ? { ...item, status: "approved" } : item));
      } else {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert(t("actionError"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this restaurant? This cannot be undone.")) return;
    
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/restaurants/${id}?secret=${secret}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Delete failed");
      
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFormSuccess = () => {
    setEditingRestaurant(null);
    setIsCreatingNew(false);
    fetchAllItems();
  };

  const pendingItems = items.filter(i => i.status === "pending");
  const approvedItems = items.filter(i => i.status === "approved" || !i.status);
  
  const filteredApprovedItems = approvedItems.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (i.nameZh && i.nameZh.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
        <form onSubmit={checkAuth} className={`${styles.card} w-full max-w-md shadow-2xl flex flex-col items-center gap-6`} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1, delay: 0.2 }} className="text-6xl sm:text-7xl drop-shadow-md mb-2">🔐</motion.div>
          <div className="text-center w-full mb-2">
            <h1 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>{t("loginTitle")}</h1>
            <p className="text-sm sm:text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("loginDesc")}</p>
          </div>
          <div className="w-full">
            <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} className="form-input w-full text-center tracking-widest text-base sm:text-lg transition-all" placeholder={t("passwordPlaceholder")} style={{ padding: "16px 20px", borderRadius: "16px" }} />
          </div>
          <motion.button type="submit" className="w-full font-bold text-white flex items-center justify-center gap-2 text-base sm:text-lg mt-2" style={{ padding: '16px 20px', borderRadius: "16px", background: "linear-gradient(135deg, #F5A623, #FF6B6B)", boxShadow: "0 8px 20px -6px rgba(245, 166, 35, 0.5)" }} whileHover={{ scale: 1.02, boxShadow: "0 12px 24px -8px rgba(245, 166, 35, 0.6)" }} whileTap={{ scale: 0.98 }}>{t("loginBtn")}</motion.button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)", padding: "40px 20px" }}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight mb-1">{t("dashboardTitle")}</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Manage community submissions and database</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsCreatingNew(true)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-sm flex items-center gap-2 transition-transform hover:scale-105" style={{ background: "#F5A623" }}>
              + Add New
            </button>
            <motion.button onClick={fetchAllItems} className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} whileHover={{ scale: 1.02, backgroundColor: "var(--border-color)" }} whileTap={{ scale: 0.98 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
              {t("refreshBtn")}
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8 border-b border-[var(--border-color)]">
          <button 
            onClick={() => setActiveTab("pending")} 
            className={`pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === "pending" ? "border-[#F5A623] text-[#F5A623]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
          >
            Pending Approvals ({pendingItems.length})
          </button>
          <button 
            onClick={() => setActiveTab("manage")} 
            className={`pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === "manage" ? "border-[#F5A623] text-[#F5A623]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
          >
            All Restaurants ({approvedItems.length})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6" style={{ color: "var(--text-muted)" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--text-muted)", borderTopColor: "transparent" }} />
            <p className="text-sm font-medium tracking-wide uppercase">{t("loading")}</p>
          </div>
        ) : activeTab === "pending" ? (
          // Pending Tab
          pendingItems.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center rounded-2xl flex flex-col items-center gap-4" style={{ border: "1px dashed var(--border-color)", padding: "80px 20px" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="text-base font-medium" style={{ color: "var(--text-primary)" }}>All caught up</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("empty")}</p>
            </motion.div>
          ) : (
            <div className="flex flex-col" style={{ gap: "24px" }}>
              {pendingItems.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl transition-all shadow-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "32px" }}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center" style={{ gap: "24px" }}>
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>{item.name}</h2>
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide uppercase" style={{ background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                          {item.submittedBy || "Anonymous"}
                        </span>
                      </div>
                      <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                        <div><div className="uppercase tracking-widest opacity-60 mb-1 text-[10px]">{t("category")}</div><div className="font-medium" style={{ color: "var(--text-primary)" }}>{item.category}</div></div>
                        <div><div className="uppercase tracking-widest opacity-60 mb-1 text-[10px]">{t("funnyScore")}</div><div className="font-medium" style={{ color: "var(--text-primary)" }}>{item.funnyScore} / 5</div></div>
                        <div className="col-span-2"><div className="uppercase tracking-widest opacity-60 mb-1 text-[10px]">{t("address")}</div><div className="font-medium truncate" style={{ color: "var(--text-primary)" }} title={item.address}>{item.address} <span className="opacity-50 font-normal">({item.area})</span></div></div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col w-full md:w-32 mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-0" style={{ borderColor: "var(--border-color)", gap: "12px" }}>
                      <motion.button onClick={() => handleAction(item.id, "approve")} disabled={actionLoading === item.id} className="flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border shadow-sm" style={{ background: "var(--text-primary)", color: "var(--bg-primary)", borderColor: "var(--text-primary)" }}>{actionLoading === item.id ? "..." : t("approveBtn")}</motion.button>
                      <motion.button onClick={() => handleAction(item.id, "reject")} disabled={actionLoading === item.id} className="flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border shadow-sm" style={{ background: "transparent", color: "var(--text-secondary)", borderColor: "var(--border-color)" }}>{actionLoading === item.id ? "..." : t("rejectBtn")}</motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          // Manage All Tab
          <div className="flex flex-col gap-6">
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm outline-none" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApprovedItems.map((item) => (
                <div key={item.id} className="rounded-2xl shadow-sm flex flex-col overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                  <div className="h-32 bg-gray-200 relative">
                    <img src={item.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <h4 className="text-sm text-[var(--text-muted)] mb-4 truncate">{item.nameZh || ""}</h4>
                    <div className="flex-1"></div>
                    <div className="flex justify-between items-center border-t border-[var(--border-color)] pt-4 mt-2">
                      <button onClick={() => setEditingRestaurant(item)} className="text-sm font-bold text-[#F5A623] hover:underline">Edit</button>
                      <button onClick={() => handleDelete(item.id)} disabled={actionLoading === item.id} className="text-sm font-bold text-red-500 hover:underline">{actionLoading === item.id ? "..." : "Delete"}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin Form Modal */}
      <AnimatePresence>
        {(editingRestaurant || isCreatingNew) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => { setEditingRestaurant(null); setIsCreatingNew(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[var(--bg-primary)] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
                <h2 className="text-xl font-bold">{isCreatingNew ? "Add New Restaurant" : "Edit Restaurant"}</h2>
                <button onClick={() => { setEditingRestaurant(null); setIsCreatingNew(false); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors">✕</button>
              </div>
              <div className="p-6 overflow-y-auto">
                <AdminRestaurantForm 
                  initialData={editingRestaurant || undefined} 
                  secret={secret} 
                  onSuccess={handleFormSuccess} 
                  onCancel={() => { setEditingRestaurant(null); setIsCreatingNew(false); }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
