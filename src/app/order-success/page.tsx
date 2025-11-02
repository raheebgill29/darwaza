"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-base">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-accent">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className="text-2xl font-semibold text-accent">Order Placed Successfully!</h1>
      
      {loading ? (
        <p className="mt-4 text-accent/80">Loading order details...</p>
      ) : orderDetails ? (
        <div className="mt-6 text-left">
          <p className="text-accent/80">Order ID: <span className="font-medium text-accent">{orderDetails.id}</span></p>
          <p className="mt-1 text-accent/80">Date: <span className="font-medium text-accent">
            {new Date(orderDetails.created_at).toLocaleDateString()}
          </span></p>
          <p className="mt-1 text-accent/80">Total: <span className="font-medium text-accent">
            Rs {orderDetails.total_amount.toLocaleString("en-IN")}
          </span></p>
          <p className="mt-1 text-accent/80">Payment Method: <span className="font-medium text-accent">
            {orderDetails.payment_method}
          </span></p>
          
          <div className="mt-4 rounded-md bg-brand-base p-4">
            <p className="text-accent">
              We've received your order and will contact you soon to confirm delivery details.
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-accent/80">
          Your order has been placed successfully. We'll send you a confirmation email with your order details.
        </p>
      )}
      
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="rounded-full bg-brand-base px-5 py-2 text-accent hover:opacity-90">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <OrderSuccessContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}