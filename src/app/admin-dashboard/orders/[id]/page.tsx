"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderDetailsCard from "@/components/OrderDetailsCard";
import type { OrderRow } from "@/components/UserOrdersList";
import { supabase } from "@/lib/supabaseClient";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
        if (error) throw error;
        setOrder(data as OrderRow);
      } catch (err) {
        console.error("Error fetching order:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    setUpdating(true);
    try {
      const { data, error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id).select();
      if (error) throw error;
      setOrder((data?.[0] ?? null) as OrderRow | null);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-accent">Order Details</h1>
          <button
            type="button"
            onClick={() => router.push("/admin-dashboard/orders")}
            className="rounded-full border border-brand-200 px-4 py-2 text-accent hover:bg-brand-base"
          >
            Back to Orders
          </button>
        </div>

        {loading ? (
          <div className="mt-6 text-accent/80">Loading order...</div>
        ) : (
          <>
            <div className="mt-6 flex items-center gap-3">
              <label htmlFor="status" className="text-sm text-accent/80">Update Status:</label>
              <select
                id="status"
                value={order?.status ?? "pending"}
                onChange={(e) => updateStatus(e.target.value)}
                className="rounded-md border border-brand-200 bg-white p-2 text-sm text-accent"
                disabled={updating}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
              <OrderDetailsCard order={order} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}