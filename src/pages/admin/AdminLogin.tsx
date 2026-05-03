import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Coffee, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const { signIn, signUp, user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) nav("/admin", { replace: true });
  }, [user, isAdmin, loading, nav]);

  const claimAdminIfFirst = async (uid: string) => {
    // If no admin exists yet, grant admin to this user (bootstrap)
    const { count } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) === 0) {
      await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      toast.success("First admin account created.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    if (error) {
      toast.error(error);
      setBusy(false);
      return;
    }
    const { data: { user: u } } = await supabase.auth.getUser();
    if (u) await claimAdminIfFirst(u.id);
    toast.success(mode === "login" ? "Welcome back." : "Account created.");
    setBusy(false);
    nav("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-foreground text-background">
        <Link to="/" className="flex items-center gap-2 group w-fit">
          <Coffee className="h-5 w-5 text-accent" />
          <span className="font-display text-xl">BrewCraft<span className="text-accent">.</span></span>
        </Link>
        <div className="max-w-md">
          <p className="eyebrow text-accent mb-4">Admin Console</p>
          <h1 className="font-display text-5xl leading-tight mb-6">
            Run the roastery.
          </h1>
          <p className="text-background/70 leading-relaxed">
            Manage your catalog, fulfill orders, and trigger automations — all from one secure dashboard.
          </p>
        </div>
        <p className="text-xs text-background/50">© BrewCraft Co. — Crafted with intention.</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <p className="eyebrow mb-3">{mode === "login" ? "Sign in" : "Create account"}</p>
          <h2 className="font-display text-3xl font-medium mb-2">
            {mode === "login" ? "Welcome back." : "Set up your admin."}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {mode === "login"
              ? "Enter your credentials to access the dashboard."
              : "The first account created becomes the store admin."}
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-11 rounded-none" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-11 rounded-none" />
            </div>
            <Button type="submit" disabled={busy}
              className="w-full h-12 rounded-none bg-foreground text-background hover:bg-foreground/90">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === "login" ? "Need an account? Sign up" : "Already have one? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
