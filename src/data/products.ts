import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: "Single Origin" | "Blends" | "Espresso" | "Decaf";
  type: "Whole Bean" | "Ground";
  image: string;
  gallery: string[];
  short: string;
  long: string;
  bestseller?: boolean;
  featured?: boolean;
  notes: string[];
};

export const products: Product[] = [
  {
    id: "1", slug: "ethiopia-yirgacheffe", name: "Ethiopia Yirgacheffe",
    price: 24, category: "Single Origin", type: "Whole Bean",
    image: p1, gallery: [p1, p2, p6],
    short: "Floral, citrus, and bright stone fruit. A delicate cup with sparkling acidity.",
    long: "Sourced from smallholder farms in the Yirgacheffe region of Ethiopia, this washed-process coffee delivers the unmistakable elegance of a true heirloom varietal. Expect jasmine, bergamot, and a clean, tea-like body. Roasted to a light medium to preserve the inherent sweetness and complexity. Best enjoyed as pour-over or filter.",
    featured: true, bestseller: true,
    notes: ["Jasmine", "Bergamot", "Stone fruit"],
  },
  {
    id: "2", slug: "midnight-roast", name: "Midnight Roast Blend",
    price: 22, category: "Blends", type: "Whole Bean",
    image: p3, gallery: [p3, p2, p1],
    short: "Dark chocolate, toasted almond, deep caramel. Bold and unapologetic.",
    long: "Our signature dark roast — a meticulous blend of Brazilian and Sumatran beans roasted to a rich, oily finish. Crafted for those who take their coffee strong, with notes of dark chocolate, molasses, and toasted nuts. Excellent for espresso, French press, or moka pot.",
    featured: true, bestseller: true,
    notes: ["Dark chocolate", "Almond", "Caramel"],
  },
  {
    id: "3", slug: "colombia-huila", name: "Colombia Huila",
    price: 21, category: "Single Origin", type: "Whole Bean",
    image: p4, gallery: [p4, p2, p1],
    short: "Honey sweetness, red apple, soft cocoa. A versatile, balanced cup.",
    long: "From the high-altitude farms of Huila, Colombia. Washed and sun-dried, this coffee strikes a beautiful balance between sweetness and structure. Notes of red apple, honey, and milk chocolate make it an everyday favorite for any brew method.",
    featured: true,
    notes: ["Red apple", "Honey", "Cocoa"],
  },
  {
    id: "4", slug: "espresso-no-7", name: "Espresso No. 7",
    price: 26, category: "Espresso", type: "Whole Bean",
    image: p5, gallery: [p5, p6, p3],
    short: "Caramelized sugar, ripe plum, syrupy body. Built for the lever.",
    long: "Seven origins, one perfect shot. Espresso No. 7 is our flagship espresso blend — designed to pull thick, syrupy shots with a glossy crema. Plum jam, brown sugar, and a long chocolate finish. Equally stunning in milk drinks.",
    featured: true, bestseller: true,
    notes: ["Brown sugar", "Plum", "Chocolate"],
  },
  {
    id: "5", slug: "decaf-swiss-water", name: "Decaf Swiss Water",
    price: 23, category: "Decaf", type: "Ground",
    image: p2, gallery: [p2, p1, p4],
    short: "Chemical-free decaf with full flavor. Cocoa, hazelnut, dried fig.",
    long: "Decaffeinated using only pure water, temperature, and time — never chemicals. The result is a clean, full-bodied cup that doesn't compromise on flavor. Perfect for evening rituals.",
    bestseller: true,
    notes: ["Cocoa", "Hazelnut", "Fig"],
  },
  {
    id: "6", slug: "house-blend", name: "House Blend",
    price: 19, category: "Blends", type: "Ground",
    image: p6, gallery: [p6, p3, p1],
    short: "Smooth, rounded, dependable. The cup we drink every morning.",
    long: "A versatile medium roast blend of Central and South American coffees. Smooth, balanced, and approachable — with notes of milk chocolate, almond, and a hint of citrus. The perfect everyday brew.",
    bestseller: true,
    notes: ["Milk chocolate", "Almond", "Citrus"],
  },
];

export const categories = ["All", "Single Origin", "Blends", "Espresso", "Decaf"] as const;
export const types = ["All", "Whole Bean", "Ground"] as const;

export type Coupon = {
  code: string;
  percent: number;
  minOrder: number;
  expiresAt: string;
  usageLimit: number;
};

export const coupons: Coupon[] = [
  { code: "WELCOME10", percent: 10, minOrder: 0, expiresAt: "2030-12-31", usageLimit: 1000 },
  { code: "COMEBACK15", percent: 15, minOrder: 40, expiresAt: "2030-12-31", usageLimit: 500 },
  { code: "THANKYOU5", percent: 5, minOrder: 0, expiresAt: "2030-12-31", usageLimit: 9999 },
  { code: "REVIEW20", percent: 20, minOrder: 60, expiresAt: "2030-12-31", usageLimit: 200 },
];

export function validateCoupon(code: string, subtotal: number): { ok: boolean; coupon?: Coupon; error?: string } {
  const c = coupons.find((x) => x.code.toUpperCase() === code.trim().toUpperCase());
  if (!c) return { ok: false, error: "Invalid coupon code" };
  if (new Date(c.expiresAt) < new Date()) return { ok: false, error: "Coupon has expired" };
  if (subtotal < c.minOrder) return { ok: false, error: `Minimum order of $${c.minOrder} required` };
  return { ok: true, coupon: c };
}
