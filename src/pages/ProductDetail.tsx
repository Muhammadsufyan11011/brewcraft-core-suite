import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Minus, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  if (!product) return <Navigate to="/shop" replace />;

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="container-wide py-12 md:py-16">
      <nav className="text-xs text-muted-foreground mb-8 uppercase tracking-widest">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div className="aspect-square overflow-hidden bg-secondary mb-4">
            <img src={product.gallery[active]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden bg-secondary transition-all ${i === active ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <p className="eyebrow mb-3">{product.category} · {product.type}</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium leading-tight mb-4">{product.name}</h1>
          <p className="font-display text-2xl mb-6">${product.price}</p>
          <p className="text-muted-foreground leading-relaxed mb-6">{product.short}</p>

          <div className="flex gap-2 mb-8">
            {product.notes.map((n) => (
              <span key={n} className="text-xs px-3 py-1.5 bg-secondary rounded-full">{n}</span>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 flex items-center justify-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-12 w-12 flex items-center justify-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
            </div>
            <Button
              size="lg"
              onClick={() => { add(product, qty); toast.success(`${product.name} added to cart`); }}
              className="flex-1 h-12 rounded-none bg-foreground text-background hover:bg-foreground/90"
            >
              Add to cart — ${(product.price * qty).toFixed(2)}
            </Button>
          </div>

          <div className="border-t border-border pt-8 space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">About this coffee</h3>
              <p className="text-muted-foreground leading-relaxed">{product.long}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4">
              <div><p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Roast</p><p>Medium</p></div>
              <div><p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Weight</p><p>12 oz / 340g</p></div>
              <div><p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Process</p><p>Washed</p></div>
              <div><p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Ships</p><p>Within 48 hrs</p></div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-medium">You may also like</h2>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm link-underline">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
