"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import CartIcon from "@/components/icons/CartIcon";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create order in database
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          notes: formData.notes,
          payment_method: "Cash on Delivery",
          status: "pending",
          total_amount: total,
          items: items
        })
        .select();
      
      if (error) throw error;
      const orderId = data?.[0]?.id;

      // Deduct stock for each item (product and per-size when applicable)
      for (const it of items) {
        const productId = it.id; // for DB-backed products, this is the product.id
        // Fetch product to ensure it exists in DB and get current stock
        const { data: prod, error: pErr } = await supabase
          .from('products')
          .select('id, stock')
          .eq('id', productId)
          .single();
        if (pErr || !prod) {
          // Skip deduction for non-DB products
          continue;
        }

        // Check if product has per-size stock rows
        const { data: sizeRows } = await supabase
          .from('product_sizes')
          .select('size, stock')
          .eq('product_id', productId);

        // Always reduce overall product stock
        const newTotalStock = Math.max(0, (prod.stock ?? 0) - it.qty);
        await supabase
          .from('products')
          .update({ stock: newTotalStock })
          .eq('id', productId);

        // If sizes exist and item has a selected size, deduct from that size's stock
        if ((sizeRows && sizeRows.length > 0) && it.size) {
          const row = sizeRows.find((r: any) => r.size === it.size);
          if (row) {
            const newSizeStock = Math.max(0, (row.stock ?? 0) - it.qty);
            await supabase
              .from('product_sizes')
              .update({ stock: newSizeStock })
              .eq('product_id', productId)
              .eq('size', it.size);
          }
        }
      }
      
      // Clear cart and redirect to success page
      clear();
      router.push(`/order-success?id=${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-50 font-sans">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold text-accent">Checkout</h1>
          <p className="mt-4 text-accent/80">Your cart is empty. Please add items to your cart before checkout.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 rounded-full bg-brand-base px-5 py-2 text-accent hover:opacity-90 flex items-center gap-2"
          >
            <span>Continue Shopping</span>
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-accent">Checkout</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Order Form */}
          <div>
            <h2 className="text-xl font-semibold text-accent">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm text-accent/80">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-brand-200 bg-white p-2 text-accent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm text-accent/80">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-brand-200 bg-white p-2 text-accent"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm text-accent/80">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-brand-200 bg-white p-2 text-accent"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm text-accent/80">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-brand-200 bg-white p-2 text-accent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm text-accent/80">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-brand-200 bg-white p-2 text-accent"
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm text-accent/80">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-brand-200 bg-white p-2 text-accent"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm text-accent/80">Order Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-brand-200 bg-white p-2 text-accent"
                />
              </div>
              
              <div className="mt-6 rounded-md bg-brand-base p-4">
                <h3 className="font-semibold text-accent">Payment Method</h3>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    checked
                    readOnly
                    className="h-4 w-4"
                  />
                  <label htmlFor="cod" className="text-accent">Cash on Delivery</label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-full bg-brand-base px-5 py-3 text-accent hover:opacity-90 flex items-center justify-center gap-2"
              >
                <CartIcon className="w-5 h-5" />
                <span>{isSubmitting ? "Processing..." : "Place Order"}</span>
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold text-accent">Order Summary</h2>
            <div className="mt-4 rounded-md border border-brand-200 bg-white p-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size ?? 'nosize'}`} className="flex items-center gap-3">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.title} className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded bg-accent/10" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-accent">{item.title}</p>
                      {item.size && (
                        <p className="text-xs text-accent/70">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-accent/80">
                        Rs {item.price.toLocaleString("en-IN")} × {item.qty}
                      </p>
                    </div>
                    <p className="font-medium text-accent">
                      Rs {(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 border-t border-brand-200 pt-4">
                <div className="flex justify-between">
                  <p className="text-accent/80">Subtotal</p>
                  <p className="font-medium text-accent">Rs {total.toLocaleString("en-IN")}</p>
                </div>
                <div className="mt-2 flex justify-between">
                  <p className="text-accent/80">Shipping</p>
                  <p className="font-medium text-accent">Free</p>
                </div>
                <div className="mt-4 flex justify-between border-t border-brand-200 pt-4">
                  <p className="font-semibold text-accent">Total</p>
                  <p className="font-semibold text-accent">Rs {total.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}