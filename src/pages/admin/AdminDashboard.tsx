import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, DollarSign, Package, TrendingUp } from "lucide-react";

type Stat = { label: string; value: string; icon: React.ElementType };

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, processing: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [ordersRes, productsRes, recentRes] = await Promise.all([
        supabase.from("orders").select("total,status"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      const orders = ordersRes.data ?? [];
      setStats({
        orders: orders.length,
        revenue: orders.reduce((s, o: any) => s + Number(o.total ?? 0), 0),
        products: productsRes.count ?? 0,
        processing: orders.filter((o: any) => o.status === "processing").length,
      });
      setRecent(recentRes.data ?? []);
      setLoading(false);
    })();
  }, []);

  const cards: Stat[] = [
    { label: "Total Orders", value: String(stats.orders), icon: ShoppingBag },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign },
    { label: "Products", value: String(stats.products), icon: Package },
    { label: "Processing", value: String(stats.processing), icon: TrendingUp },
  ];

  return (
    <div className="p-10 max-w-7xl">
      <p className="eyebrow mb-3">Overview</p>
      <h1 className="font-display text-4xl font-medium mb-10">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => (
          <div key={c.label} className="border border-border bg-card p-6 hover:shadow-soft transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="font-display text-3xl font-medium">{loading ? "—" : c.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-border bg-card">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm text-accent hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No orders yet.</td></tr>
              )}
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 font-mono text-xs">{o.order_number}</td>
                  <td className="px-6 py-4">{o.customer_name}</td>
                  <td className="px-6 py-4 capitalize">{o.status}</td>
                  <td className="px-6 py-4 text-right">${Number(o.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
