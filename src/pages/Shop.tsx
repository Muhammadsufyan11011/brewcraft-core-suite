import { useMemo, useState } from "react";
import { products, categories, types } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";

export default function Shop() {
  const [cat, setCat] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(30);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (type === "All" || p.type === type) &&
          p.price <= maxPrice
      ),
    [cat, type, maxPrice]
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
        {/* Filters */}
        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4">Category</h3>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCat(c)}
                    className={`text-sm transition-colors ${cat === c ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4">Grind</h3>
            <ul className="space-y-2">
              {types.map((t) => (
                <li key={t}>
                  <button
                    onClick={() => setType(t)}
                    className={`text-sm transition-colors ${type === t ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4">Max price: ${maxPrice}</h3>
            <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={15} max={30} step={1} />
          </div>
        </aside>

        {/* Grid */}
        <div>
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} products</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <p className="text-muted-foreground py-20 text-center">No coffees match those filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
