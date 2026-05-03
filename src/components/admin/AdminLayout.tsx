import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Coffee } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const nav = useNavigate();

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-foreground text-background"
        : "text-foreground/70 hover:text-foreground hover:bg-secondary"
    }`;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border flex flex-col p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 py-3 mb-6">
          <Coffee className="h-5 w-5 text-accent" />
          <span className="font-display text-lg font-semibold">
            BrewCraft<span className="text-accent">.</span>
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">Admin</span>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkCls}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </NavLink>
          <NavLink to="/admin/orders" className={linkCls}>
            <ShoppingBag className="h-4 w-4" /> Orders
          </NavLink>
          <NavLink to="/admin/products" className={linkCls}>
            <Package className="h-4 w-4" /> Products
          </NavLink>
        </nav>
        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground px-2 mb-3 truncate">{user?.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={async () => { await signOut(); nav("/admin/login"); }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
