import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Shop() {
  const { products, loading } = useProducts();
  const [cat, setCat] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(50);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  useEffect(() => {
    if (products.length) {
      const m = Math.max(...products.map((p) => Number(p.price)));
      setMaxPrice((cur) => (cur < m ? Math.ceil(m) : cur));
    }
  }, [products.length]);

  const max = Math.max(30, ...products.map((p) => Number(p.price)));

  const filtered = useMemo(
    () =>
      products.filter(
        (p) => (cat === "All" || p.category === cat) && Number(p.price) <= maxPrice
      ),
    [products, cat, maxPrice]
  );

  return (
    <div className="container-wide py-16">
      <div className="mb-14 max-w-3xl">
        <p className="eyebrow mb-4">All Coffee</p>
        <h1 className="font-display text-5xl md:text-6xl font-medium leading-tight text-balance">
          The full collection, roasted this week.
        </h1>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-12">
        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4">Category</h3>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCat(c)}
                    className={`text-sm capitalize transition-colors ${cat === c ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4">Max price: ${maxPrice}</h3>
            <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={10} max={Math.ceil(max)} step={1} />
          </div>
        </aside>

        <div>
          <p className="text-sm text-muted-foreground mb-6">
            {loading ? "Loading…" : `${filtered.length} products`}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}><Skeleton className="aspect-[4/5] mb-4" /><Skeleton className="h-4 w-2/3" /></div>
                ))
              : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {!loading && filtered.length === 0 && (
            <p className="text-muted-foreground py-20 text-center">No coffees match those filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
