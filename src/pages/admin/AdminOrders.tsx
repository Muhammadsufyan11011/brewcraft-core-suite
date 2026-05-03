import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const STATUSES = ["processing", "shipped", "delivered", "cancelled", "refunded"];
const PAGE_SIZE = 10;

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const updateStatus = async (order: any, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    setOrders((cur) => cur.map((o) => (o.id === order.id ? { ...o, status } : o)));
    if (open && open.id === order.id) setOpen({ ...open, status });

    // Fire status-update webhook
    try {
      await supabase.functions.invoke("order-webhook", {
        body: {
          event: "order.status_updated",
          order_id: order.order_number,
          name: order.customer_name,
          email: order.email,
          phone: order.phone,
          items: order.items,
          total: order.total,
          status,
        },
      });
    } catch (e) {
      console.error("webhook error", e);
    }
  };

  return (
    <div className="p-10 max-w-7xl">
      <p className="eyebrow mb-3">Orders</p>
      <h1 className="font-display text-4xl font-medium mb-8">Manage orders</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Search order #, name, email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="max-w-sm rounded-none h-10"
        />
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-44 rounded-none h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={load} className="rounded-none h-10 ml-auto">Refresh</Button>
      </div>

      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && view.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No orders found.</td></tr>
            )}
            {view.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                <td className="px-6 py-4 font-mono text-xs">{o.order_number}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <Select value={o.status} onValueChange={(v) => updateStatus(o, v)}>
                    <SelectTrigger className="h-8 w-36 rounded-none text-xs capitalize"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 text-right font-medium">${Number(o.total).toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" variant="ghost" onClick={() => setOpen(o)}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-muted-foreground">{filtered.length} orders</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-none">Prev</Button>
          <span className="px-3 py-1.5">{page + 1} / {pages}</span>
          <Button variant="outline" size="sm" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)} className="rounded-none">Next</Button>
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{open.order_number}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground text-xs uppercase tracking-widest">Customer</span><p>{open.customer_name}</p></div>
                <div><span className="text-muted-foreground text-xs uppercase tracking-widest">Email</span><p>{open.email}</p></div>
                <div><span className="text-muted-foreground text-xs uppercase tracking-widest">Phone</span><p>{open.phone}</p></div>
                <div><span className="text-muted-foreground text-xs uppercase tracking-widest">Status</span><p className="capitalize">{open.status}</p></div>
                <div className="col-span-2"><span className="text-muted-foreground text-xs uppercase tracking-widest">Address</span><p className="whitespace-pre-line">{open.address}</p></div>
                {open.notes && <div className="col-span-2"><span className="text-muted-foreground text-xs uppercase tracking-widest">Notes</span><p>{open.notes}</p></div>}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Items</h3>
                {(open.items as any[])?.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{it.name} <span className="text-muted-foreground">× {it.qty}</span></span>
                    <span>${(it.price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${Number(open.subtotal).toFixed(2)}</span></div>
                {Number(open.discount) > 0 && <div className="flex justify-between text-accent"><span>Discount</span><span>−${Number(open.discount).toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${Number(open.shipping).toFixed(2)}</span></div>
                <div className="flex justify-between font-display text-lg pt-2 border-t border-border mt-2"><span>Total</span><span>${Number(open.total).toFixed(2)}</span></div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
