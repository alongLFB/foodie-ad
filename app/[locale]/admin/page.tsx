"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingItems, setPendingItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const checkAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret === "foodie2025") {
      setIsAuthenticated(true);
      fetchPendingItems();
    } else {
      alert("Invalid secret");
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
      alert("Failed to fetch pending items");
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
      alert(`Failed to ${action} item`);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <form onSubmit={checkAuth} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black dark:text-white dark:bg-gray-700"
            placeholder="Enter secret"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">Admin Review Dashboard</h1>
          <button
            onClick={fetchPendingItems}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading pending items...</p>
        ) : pendingItems.length === 0 ? (
          <p className="text-center text-gray-500 bg-white dark:bg-gray-800 p-8 rounded-xl">
            No pending items to review! 🎉
          </p>
        ) : (
          <div className="grid gap-6">
            {pendingItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      {item.name} <span className="text-sm font-normal text-gray-500">by {item.submittedBy || item.submitted_by}</span>
                    </h2>
                    <p className="mb-2"><strong>Review:</strong> {item.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Address:</strong> {item.address} ({item.area})<br />
                      <strong>Category:</strong> {item.category}<br />
                      <strong>Vibes:</strong> {(item.vibes || []).join(", ")}<br />
                      <strong>Funny Score:</strong> {item.funnyScore || (item as any).funny_score}/5
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      disabled={actionLoading === item.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "reject")}
                      disabled={actionLoading === item.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? "..." : "Reject"}
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
