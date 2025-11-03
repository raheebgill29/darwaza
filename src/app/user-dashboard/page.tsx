"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProfileCard from "@/components/UserProfileCard";
import UserOrdersList, { OrderRow } from "@/components/UserOrdersList";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function UserDashboardPage() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const user = data.user;
      const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? null;
      setName(displayName ?? null);
      setEmail(user?.email ?? null);
      // Fetch orders for this user (by user_id or fallback to email)
      fetchOrders(user?.id ?? null, user?.email ?? null);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const fetchOrders = async (uid: string | null, emailAddr: string | null) => {
    setOrdersLoading(true);
    try {
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (uid && emailAddr) {
        query = query.or(`user_id.eq.${uid},customer_email.eq.${emailAddr}`);
      } else if (uid) {
        query = query.eq("user_id", uid);
      } else if (emailAddr) {
        query = query.eq("customer_email", emailAddr);
      } else {
        setOrders([]);
        return;
      }
      const { data, error } = await query;
      if (error) throw error;
      setOrders((data ?? []) as OrderRow[]);
    } catch (err) {
      console.error("Error fetching user orders:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-accent">User Dashboard</h1>
        {loading ? (
          <div className="text-accent/80">Loading profile...</div>
        ) : name ? (
          <>
            <UserProfileCard name={name} email={email} onLogout={onLogout} />
            <section className="mx-auto mt-8 max-w-6xl">
              <h2 className="text-xl font-semibold text-accent">My Orders</h2>
              <UserOrdersList orders={orders} loading={ordersLoading} />
            </section>
          </>
        ) : (
          <div className="rounded-xl border border-brand-200 bg-brand-base p-6">
            <p className="text-accent">You are not signed in.</p>
            <Link href="/sign-in" className="mt-3 inline-block rounded-full bg-accent px-5 py-2 text-white hover:bg-accent/90">Sign In</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}