import { Link } from "react-router-dom";
import { DBProduct } from "@/hooks/useProducts";

export default function ProductCard({ product }: { product: DBProduct }) {
  const img = product.images?.[0] || "/placeholder.svg";
  const outOfStock = product.stock <= 0;
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-4">
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.bestseller && !outOfStock && (
          <span className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
            Bestseller
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-foreground text-background px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
            Sold out
          </span>
        )}
      </div>
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1 capitalize">{product.category}</p>
          <h3 className="font-display text-lg font-medium leading-tight group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </div>
        <div className="text-right">
          {product.compare_price && product.compare_price > product.price && (
            <p className="text-xs text-muted-foreground line-through">${Number(product.compare_price).toFixed(0)}</p>
          )}
          <p className="font-display text-lg">${Number(product.price).toFixed(0)}</p>
        </div>
      </div>
    </Link>
  );
}
