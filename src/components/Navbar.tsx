import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Coffee } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { count } = useCart();
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `link-underline text-sm font-medium tracking-wide transition-colors ${
      isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Coffee className="h-5 w-5 text-accent transition-transform group-hover:rotate-12" />
          <span className="font-display text-xl font-semibold tracking-tight">
            BrewCraft<span className="text-accent">.</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={linkCls} end>Home</NavLink>
          <NavLink to="/shop" className={linkCls}>Shop</NavLink>
          <NavLink to="/story" className={linkCls}>Our Story</NavLink>
          <NavLink to="/journal" className={linkCls}>Journal</NavLink>
        </nav>
        <Link to="/cart" className="relative flex items-center gap-2 group">
          <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
