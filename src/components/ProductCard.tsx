import { Link } from "react-router-dom";
import { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-4">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.bestseller && (
          <span className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
            Bestseller
          </span>
        )}
      </div>
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-display text-lg font-medium leading-tight group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </div>
        <p className="font-display text-lg">${product.price}</p>
      </div>
    </Link>
  );
}
