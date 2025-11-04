'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DataTable, { DataTableColumn } from "@/components/admin/DataTable";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusBadgeClass = (status: string) => {
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
  };

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-accent">Orders</h1>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm text-accent/80">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-brand-200 bg-white p-1 text-sm text-accent"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 text-center">
            <p className="text-accent/80">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-md bg-brand-base p-4 text-center">
            <p className="text-accent">No orders found.</p>
          </div>
        ) : (
          <DataTable
            rows={orders}
            columns={orderColumns(getStatusBadgeClass, updateOrderStatus)}
            actions={[
              {
                label: "View",
                href: (o) => `/admin-dashboard/orders/${o.id}`,
                variant: "primary",
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}

function orderColumns(
  badge: (status: string) => string,
  onUpdateStatus: (orderId: string, newStatus: string) => void
): DataTableColumn<any>[] {
  return [
    { header: "Order ID", cell: (o) => <span className="font-mono">{String(o.id).substring(0, 8)}...</span> },
    { header: "Date", cell: (o) => new Date(o.created_at).toLocaleDateString() },
    {
      header: "Customer",
      cell: (o) => (
        <div>
          <p className="font-medium">{o.customer_name}</p>
          <p className="text-xs text-accent/80">{o.customer_email}</p>
        </div>
      ),
    },
    { header: "Total", cell: (o) => <>Rs {Number(o.total_amount).toLocaleString("en-IN")}</> },
    {
      header: "Status",
      cell: (o) => (
        <div className="flex items-center gap-2">
          <span className={`inline-block rounded-full px-2 py-1 text-xs ${badge(o.status)}`}>
            {String(o.status).charAt(0).toUpperCase() + String(o.status).slice(1)}
          </span>
          <select
            value={o.status}
            onChange={(e) => onUpdateStatus(o.id, e.target.value)}
            className="rounded-md border border-brand-200 bg-white p-1 text-xs text-accent"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
  ]
}