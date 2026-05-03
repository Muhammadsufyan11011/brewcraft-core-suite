import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DBProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  price: number;
  compare_price: number | null;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  bestseller: boolean;
  active: boolean;
};

export function useProducts() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    setProducts(
      (data ?? []).map((p: any) => ({
        ...p,
        images: Array.isArray(p.images) ? p.images : [],
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("products-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return { products, loading, reload: load };
}
