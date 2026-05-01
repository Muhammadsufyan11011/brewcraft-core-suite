import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, setQty, remove, subtotal } = useCart();
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 6;

  if (items.length === 0) {
    return (
      <div className="container-tight py-32 text-center">
        <p className="eyebrow mb-4">Your cart</p>
        <h1 className="font-display text-4xl md:text-5xl font-medium mb-6">It's empty in here.</h1>
        <p className="text-muted-foreground mb-8">Discover our latest small-batch roasts.</p>
        <Button asChild className="rounded-none h-12 px-8 bg-foreground text-background hover:bg-foreground/90">
          <Link to="/shop">Shop coffee <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-16">
      <p className="eyebrow mb-4">Cart</p>
      <h1 className="font-display text-4xl md:text-5xl font-medium mb-12">Your selection</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-6">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-6 pb-6 border-b border-border">
              <Link to={`/product/${product.slug}`} className="w-28 h-28 md:w-32 md:h-32 bg-secondary overflow-hidden flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
                    <Link to={`/product/${product.slug}`} className="font-display text-lg font-medium hover:text-accent">{product.name}</Link>
                  </div>
                  <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="h-9 w-9 flex items-center justify-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                    <span className="w-9 text-center text-sm">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="h-9 w-9 flex items-center justify-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                  </div>
                  <p className="font-display text-lg">${(product.price * qty).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-secondary/50 p-8 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-medium mb-6">Order summary</h2>
          <div className="space-y-3 text-sm pb-6 border-b border-border">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
          </div>
          <div className="flex justify-between py-6 font-display text-xl">
            <span>Total</span><span>${(subtotal + shipping).toFixed(2)}</span>
          </div>
          <Button asChild className="w-full h-12 rounded-none bg-foreground text-background hover:bg-foreground/90">
            <Link to="/checkout">Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">Free shipping on orders over $50</p>
        </aside>
      </div>
    </div>
  );
}
