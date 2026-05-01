import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

type Order = {
  order_id: string;
  customer: { name: string; email: string };
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
};

export default function ThankYou() {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("brewcraft_last_order");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  return (
    <div className="container-tight py-24">
      <div className="text-center mb-14">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent mb-6">
          <Check className="h-7 w-7" />
        </div>
        <p className="eyebrow mb-3">Order confirmed</p>
        <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">Thank you{order ? `, ${order.customer.name.split(" ")[0]}` : ""}.</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your coffee will be roasted fresh and shipped within 48 hours. A confirmation has been sent {order ? `to ${order.customer.email}` : ""}.
        </p>
      </div>

      {order && (
        <div className="bg-secondary/50 p-8">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Order number</p>
              <p className="font-display text-xl">{order.order_id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Status</p>
              <p className="text-accent font-medium uppercase text-sm tracking-wider">{order.status}</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{i.name} <span className="text-muted-foreground">× {i.qty}</span></span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-6 border-t border-border font-display text-xl">
            <span>Total</span><span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="text-center mt-10">
        <Button asChild className="rounded-none h-12 px-8 bg-foreground text-background hover:bg-foreground/90">
          <Link to="/shop">Continue shopping <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
}
