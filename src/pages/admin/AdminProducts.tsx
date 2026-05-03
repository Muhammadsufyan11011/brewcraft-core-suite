import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["beans", "equipment", "accessories"];
const PAGE_SIZE = 10;

type Product = {
  id?: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  price: number;
  compare_price: number | null;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  bestseller: boolean;
  active: boolean;
};

const empty: Product = {
  name: "", slug: "", short_description: "", long_description: "",
  price: 0, compare_price: null, category: "beans", stock: 0,
  images: [], featured: false, bestseller: false, active: true,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminProducts() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Product | null>(null);
  const [imageInput, setImageInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setList(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
  }, [list, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const openNew = () => { setEditing({ ...empty }); setImageInput(""); };
  const openEdit = (p: any) => {
    setEditing({ ...p, images: Array.isArray(p.images) ? p.images : [], compare_price: p.compare_price ?? null });
    setImageInput("");
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error("Name required");
    const slug = editing.slug || slugify(editing.name);
    const payload = { ...editing, slug, price: Number(editing.price), stock: Number(editing.stock),
      compare_price: editing.compare_price ? Number(editing.compare_price) : null };
    setSaving(true);
    let error;
    if (editing.id) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Product updated" : "Product created");
    setEditing(null);
    load();
  };

  const remove = async (p: any) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    load();
  };

  const addImage = () => {
    if (!editing || !imageInput.trim()) return;
    setEditing({ ...editing, images: [...editing.images, imageInput.trim()] });
    setImageInput("");
  };

  return (
    <div className="p-10 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow mb-3">Catalog</p>
          <h1 className="font-display text-4xl font-medium">Products</h1>
        </div>
        <Button onClick={openNew} className="rounded-none bg-foreground text-background hover:bg-foreground/90 h-11">
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <Input placeholder="Search products…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="max-w-sm rounded-none h-10" />
      </div>

      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-right">Stock</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && view.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No products yet.</td></tr>
            )}
            {view.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-10 h-10 object-cover" />}
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{p.category}</td>
                <td className="px-6 py-4 text-right">${Number(p.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-right">{p.stock}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 ${p.active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {p.active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(p)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-muted-foreground">{filtered.length} products</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-none">Prev</Button>
          <span className="px-3 py-1.5">{page + 1} / {pages}</span>
          <Button variant="outline" size="sm" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)} className="rounded-none">Next</Button>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  {editing.id ? "Edit product" : "New product"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Name</Label>
                  <Input value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })}
                    className="mt-1.5 rounded-none" />
                </div>
                <div className="col-span-2">
                  <Label>Slug</Label>
                  <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} className="mt-1.5 rounded-none" />
                </div>
                <div className="col-span-2">
                  <Label>Short description</Label>
                  <Input value={editing.short_description}
                    onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="mt-1.5 rounded-none" />
                </div>
                <div className="col-span-2">
                  <Label>Long description</Label>
                  <Textarea rows={4} value={editing.long_description}
                    onChange={(e) => setEditing({ ...editing, long_description: e.target.value })} className="mt-1.5 rounded-none" />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input type="number" step="0.01" value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="mt-1.5 rounded-none" />
                </div>
                <div>
                  <Label>Compare price (optional)</Label>
                  <Input type="number" step="0.01" value={editing.compare_price ?? ""}
                    onChange={(e) => setEditing({ ...editing, compare_price: e.target.value ? Number(e.target.value) : null })} className="mt-1.5 rounded-none" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger className="mt-1.5 rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input type="number" value={editing.stock}
                    onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="mt-1.5 rounded-none" />
                </div>
                <div className="col-span-2">
                  <Label>Image URLs</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)}
                      placeholder="https://…" className="rounded-none" />
                    <Button type="button" variant="outline" onClick={addImage} className="rounded-none">Add</Button>
                  </div>
                  {editing.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {editing.images.map((src, i) => (
                        <div key={i} className="relative group">
                          <img src={src} alt="" className="w-16 h-16 object-cover border border-border" />
                          <button type="button"
                            onClick={() => setEditing({ ...editing, images: editing.images.filter((_, j) => j !== i) })}
                            className="absolute -top-2 -right-2 bg-foreground text-background rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3"><Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} /><Label>Featured</Label></div>
                <div className="flex items-center gap-3"><Switch checked={editing.bestseller} onCheckedChange={(v) => setEditing({ ...editing, bestseller: v })} /><Label>Bestseller</Label></div>
                <div className="flex items-center gap-3"><Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} /><Label>Active (visible in store)</Label></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)} className="rounded-none">Cancel</Button>
                <Button onClick={save} disabled={saving} className="rounded-none bg-foreground text-background hover:bg-foreground/90">
                  {saving ? "Saving…" : "Save product"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
