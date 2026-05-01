import { Coffee, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-brown-deep text-cream">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="h-5 w-5 text-gold" />
            <span className="font-display text-xl font-semibold">BrewCraft<span className="text-gold">.</span></span>
          </div>
          <p className="text-cream/70 max-w-sm leading-relaxed">
            Single-origin coffee, hand-roasted in small batches. Sourced direct, shipped fresh.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="text-cream/60 hover:text-gold transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="text-cream/60 hover:text-gold transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="text-cream/60 hover:text-gold transition-colors"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-gold uppercase tracking-widest">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/shop" className="hover:text-gold">All Coffee</Link></li>
            <li><Link to="/shop" className="hover:text-gold">Single Origin</Link></li>
            <li><Link to="/shop" className="hover:text-gold">Blends</Link></li>
            <li><Link to="/shop" className="hover:text-gold">Espresso</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-gold uppercase tracking-widest">Company</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/story" className="hover:text-gold">Our Story</Link></li>
            <li><a href="#" className="hover:text-gold">Wholesale</a></li>
            <li><a href="#" className="hover:text-gold">Sustainability</a></li>
            <li><a href="#" className="hover:text-gold">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6">
        <div className="container-wide flex flex-col md:flex-row justify-between text-xs text-cream/50">
          <p>© {new Date().getFullYear()} BrewCraft Co. All rights reserved.</p>
          <p>Roasted with intention in Portland, OR</p>
        </div>
      </div>
    </footer>
  );
}
