"use client";

import Link from "next/link";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  qty: number;
};

export type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  notes: string | null;
  payment_method: string;
  status: string;
  total_amount: number;
  items: CartItem[];
  created_at: string;
};

type Props = {
  orders: OrderRow[];
  loading?: boolean;
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

export default function UserOrdersList({ orders, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-brand-base p-4 text-center">
        <p className="text-accent/80">Loading orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-xl bg-brand-base p-4 text-center">
        <p className="text-accent">No orders found.</p>
        <p className="mt-1 text-sm text-accent/70">Placed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-brand-200 bg-brand-base">
            <th className="p-3 text-left text-sm font-semibold text-accent">Order ID</th>
            <th className="p-3 text-left text-sm font-semibold text-accent">Date</th>
            <th className="p-3 text-left text-sm font-semibold text-accent">Items</th>
            <th className="p-3 text-left text-sm font-semibold text-accent">Total</th>
            <th className="p-3 text-left text-sm font-semibold text-accent">Status</th>
            <th className="p-3 text-left text-sm font-semibold text-accent">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const itemCount = Array.isArray(order.items)
              ? order.items.reduce((sum, it) => sum + (it?.qty ?? 0), 0)
              : 0;
            const itemNames = Array.isArray(order.items)
              ? order.items.slice(0, 3).map((it) => it.title).join(", ")
              : "";
            return (
              <tr key={order.id} className="border-b border-brand-200 hover:bg-brand-50">
                <td className="p-3 text-sm text-accent">
                  <span className="font-mono">{order.id.substring(0, 8)}...</span>
                </td>
                <td className="p-3 text-sm text-accent">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-sm text-accent">
                  <div>
                    <p className="text-accent/90">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                    {itemNames && (
                      <p className="text-xs text-accent/70">{itemNames}{order.items.length > 3 ? ", …" : ""}</p>
                    )}
                  </div>
                </td>
                <td className="p-3 text-sm text-accent">
                  Rs {Number(order.total_amount).toLocaleString("en-IN")}
                </td>
                <td className="p-3 text-sm">
                  <span className={`inline-block rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <Link
                    href={`/order-success?id=${order.id}`}
                    className="rounded-md border border-brand-200 px-2 py-1 text-xs text-accent hover:bg-brand-base"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}