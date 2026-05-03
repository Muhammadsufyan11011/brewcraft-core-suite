import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { validateCoupon, Coupon } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(6, "Phone required").max(30),
  address: z.string().trim().min(5, "Address required").max(300),
  notes: z.string().max(500).optional(),
});

type CheckoutOrder = {
  order_id: string;
  customer: z.infer<typeof schema>;
  items: { id: string; name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: string | null;
  status: string;
  createdAt: string;
};

const buildWebhookPayload = (order: CheckoutOrder) => {
  const totalQuantity = order.items.reduce((sum, item) => sum + item.qty, 0);
  const productNames = order.items.map((item) => item.name).join(", ");

  return {
    customer_name: order.customer.name,
    email: order.customer.email,
    product_name: productNames,
    quantity: totalQuantity,
    total_price: order.total,
    timestamp: order.createdAt,
    order_id: order.order_id,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    coupon: order.coupon,
  };
};

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0;
  const shipping = subtotal >= 50 ? 0 : 6;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = () => {
    const r = validateCoupon(code, subtotal);
    if (!r.ok) { toast.error(r.error); setCoupon(null); return; }
    setCoupon(r.coupon!);
    toast.success(`${r.coupon!.code} applied — ${r.coupon!.percent}% off`);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    const order: CheckoutOrder = {
      order_id: `BC-${Date.now()}`,
      customer: parsed.data,
      items: items.map((i) => ({ id: i.product.id, name: i.product.name, qty: i.qty, price: i.product.price })),
      subtotal,
      discount,
      shipping,
      total,
      coupon: coupon?.code ?? null,
      status: "processing",
      createdAt: new Date().toISOString(),
    };

    const payload = buildWebhookPayload(order);

    try {
      const response = await fetch("https://present19298.app.n8n.cloud/webhook-test/coffe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Webhook response status:", response.status);
      console.log("Webhook response ok:", response.ok);

      if (response.status === 200) {
        toast.success("Order placed successfully");
      } else {
        toast.error("Webhook request failed. Please try again.");
      }
    } catch (error) {
      console.error("Webhook request error:", error);
      toast.error("Error sending order to webhook.");
    }

    sessionStorage.setItem("brewcraft_last_order", JSON.stringify(order));
    clear();
    setTimeout(() => navigate("/thank-you"), 600);
  };

  if (items.length === 0) {
    return (
      <div className="container-tight py-32 text-center">
        <h1 className="font-display text-4xl mb-6">Your cart is empty</h1>
        <Button asChild className="rounded-none"><Link to="/shop">Continue shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-16">
      <p className="eyebrow mb-4">Checkout</p>
      <h1 className="font-display text-4xl md:text-5xl font-medium mb-12">Almost there.</h1>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-medium mb-6">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><Label htmlFor="name">Full name</Label><Input id="name" name="name" required maxLength={100} className="rounded-none mt-2 h-11" /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required maxLength={255} className="rounded-none mt-2 h-11" /></div>
              <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required maxLength={30} className="rounded-none mt-2 h-11" /></div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium mb-6">Shipping address</h2>
            <Textarea id="address" name="address" required maxLength={300} rows={3} className="rounded-none" />
          </section>

          <section>
            <h2 className="font-display text-xl font-medium mb-6">Order notes <span className="text-sm text-muted-foreground font-sans">(optional)</span></h2>
            <Textarea id="notes" name="notes" maxLength={500} rows={3} className="rounded-none" placeholder="Gift message, delivery preferences..." />
          </section>

          <section>
            <h2 className="font-display text-xl font-medium mb-6">Payment</h2>
            <div className="border border-dashed border-border p-6 text-sm text-muted-foreground flex items-center gap-3">
              <Lock className="h-4 w-4 text-accent" />
              <span>Secure payment via Stripe / PayPal — integration ready. Demo mode: order will be placed without charging.</span>
            </div>
          </section>
        </div>

        <aside className="bg-secondary/50 p-8 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-medium mb-6">Order summary</h2>
          <div className="space-y-4 pb-6 border-b border-border">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 text-sm">
                <div className="w-14 h-14 bg-background overflow-hidden flex-shrink-0">
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium leading-tight">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {qty}</p>
                </div>
                <p>${(product.price * qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="py-4 border-b border-border">
            <Label className="text-xs uppercase tracking-widest">Coupon code</Label>
            <div className="flex gap-2 mt-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="WELCOME10" className="rounded-none h-10" />
              <Button type="button" onClick={applyCoupon} variant="outline" className="rounded-none h-10">Apply</Button>
            </div>
            {coupon && <p className="text-xs text-accent mt-2">✓ {coupon.code} — {coupon.percent}% off</p>}
          </div>

          <div className="space-y-2 text-sm py-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-accent"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
          </div>
          <div className="flex justify-between py-4 border-t border-border font-display text-xl">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>

          <Button type="submit" disabled={submitting} className="w-full h-12 rounded-none bg-foreground text-background hover:bg-foreground/90">
            {submitting ? "Placing order..." : `Place order · $${total.toFixed(2)}`}
          </Button>
        </aside>
      </form>
    </div>
  );
}
