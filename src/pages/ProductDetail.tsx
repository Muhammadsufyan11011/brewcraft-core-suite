import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, DBProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Minus, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const found = products.find((p) => p.slug === slug);
    if (found) { setProduct(found); return; }
    if (loading) return;
    // Fall back to direct lookup (in case it's inactive or not yet loaded)
    (async () => {
      const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (!data) { setNotFound(true); return; }
      setProduct({ ...(data as any), images: Array.isArray((data as any).images) ? (data as any).images : [] });
    })();
  }, [slug, products, loading]);

  if (notFound) return <Navigate to="/shop" replace />;
  if (!product) {
    return <div className="container-wide py-24 text-muted-foreground">Loading…</div>;
  }

  const gallery = product.images.length ? product.images : ["/placeholder.svg"];
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const outOfStock = product.stock <= 0;

  return (
    <div className="container-wide py-12 md:py-16">
      <nav className="text-xs text-muted-foreground mb-8 uppercase tracking-widest">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div className="aspect-square overflow-hidden bg-secondary mb-4">
            <img src={gallery[active] ?? gallery[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square overflow-hidden bg-secondary transition-all ${i === active ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <p className="eyebrow mb-3 capitalize">{product.category}</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium leading-tight mb-4">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <p className="font-display text-2xl">${Number(product.price).toFixed(2)}</p>
            {product.compare_price && product.compare_price > product.price && (
              <p className="text-muted-foreground line-through">${Number(product.compare_price).toFixed(2)}</p>
            )}
          </div>
          {product.short_description && (
            <p className="text-muted-foreground leading-relaxed mb-6">{product.short_description}</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 flex items-center justify-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="h-12 w-12 flex items-center justify-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
            </div>
            <Button
              size="lg"
              disabled={outOfStock}
              onClick={() => {
                add({
                  id: product.id, slug: product.slug, name: product.name,
                  price: Number(product.price), image: gallery[0],
                }, qty);
                toast.success(`${product.name} added to cart`);
              }}
              className="flex-1 h-12 rounded-none bg-foreground text-background hover:bg-foreground/90"
            >
              {outOfStock ? "Sold out" : `Add to cart — $${(Number(product.price) * qty).toFixed(2)}`}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-8">
            {outOfStock ? "Currently unavailable" : `${product.stock} in stock`}
          </p>

          {product.long_description && (
            <div className="border-t border-border pt-8">
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">About this coffee</h3>
              <p className="text-muted-foreground leading-relaxed">{product.long_description}</p>
            </div>
          )}
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
