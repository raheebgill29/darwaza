"use client";

import { OrderRow } from "./UserOrdersList";

type Props = {
  order: OrderRow | null;
};

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function OrderDetailsCard({ order }: Props) {
  if (!order) {
    return (
      <div className="rounded-xl bg-brand-base p-4 text-center">
        <p className="text-accent/80">Order not found.</p>
      </div>
    );
  }

  const total = Number(order.total_amount);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-brand-200 bg-white p-4">
        <h3 className="text-accent font-semibold">Order</h3>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-accent/80">Order ID: <span className="font-mono text-accent">{order.id}</span></p>
          <p className="text-accent/80">Date: <span className="text-accent font-medium">{new Date(order.created_at).toLocaleString()}</span></p>
          <p className="text-accent/80">Payment: <span className="text-accent font-medium">{order.payment_method}</span></p>
          <p className="text-accent/80">Total: <span className="text-accent font-medium">Rs {total.toLocaleString("en-IN")}</span></p>
          <p className="text-accent/80">Status: <span className={`inline-block rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(order.status)}`}>{order.status}</span></p>
        </div>
      </div>

      <div className="rounded-xl border border-brand-200 bg-white p-4">
        <h3 className="text-accent font-semibold">Customer</h3>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-accent/80">Name: <span className="text-accent font-medium">{order.customer_name}</span></p>
          <p className="text-accent/80">Email: <span className="text-accent font-medium">{order.customer_email}</span></p>
          <p className="text-accent/80">Phone: <span className="text-accent font-medium">{order.customer_phone}</span></p>
        </div>
      </div>

      <div className="rounded-xl border border-brand-200 bg-white p-4">
        <h3 className="text-accent font-semibold">Shipping</h3>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-accent/80">Address: <span className="text-accent font-medium">{order.shipping_address}</span></p>
          <p className="text-accent/80">City: <span className="text-accent font-medium">{order.city}</span></p>
          <p className="text-accent/80">Postal Code: <span className="text-accent font-medium">{order.postal_code}</span></p>
          {order.notes && (
            <p className="text-accent/80">Notes: <span className="text-accent font-medium">{order.notes}</span></p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-brand-200 bg-white p-4 md:col-span-2">
        <h3 className="text-accent font-semibold">Items</h3>
        <div className="mt-2 divide-y divide-brand-200">
          {(order.items ?? []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 py-3">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.title} className="h-12 w-12 rounded object-cover" />
              ) : (
                <div className="h-12 w-12 rounded bg-accent/10" />
              )}
              <div className="flex-1">
                <p className="font-medium text-accent">{item.title}</p>
                <p className="text-sm text-accent/80">Rs {item.price.toLocaleString("en-IN")} × {item.qty}</p>
              </div>
              <p className="font-medium text-accent">Rs {(item.price * item.qty).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}