import { Link } from "react-router-dom";
import { ArrowRight, Truck, Leaf, Award } from "lucide-react";
import { useState, useEffect } from "react";
import hero from "@/assets/hero.jpg";
import story from "@/assets/story.jpg";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const testimonials = [
  { quote: "The best coffee I've ever brewed at home. Yirgacheffe is a revelation.", author: "Anna L.", role: "Verified buyer" },
  { quote: "Espresso No. 7 pulls like a dream. My morning ritual changed forever.", author: "Marcus T.", role: "Barista" },
  { quote: "Beautiful packaging, even better coffee. Worth every cent.", author: "Sofia R.", role: "Verified buyer" },
];

export default function Index() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center bg-brown-deep text-cream overflow-hidden">
        <img
          src={hero}
          alt="Premium artisan coffee"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brown-deep via-brown-deep/80 to-transparent" />
        <div className="container-wide relative z-10 py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow mb-6">— Spring Harvest 2026</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-balance mb-8">
              Shop the <em className="text-gold not-italic">Latest</em> Roast.
            </h1>
            <p className="text-cream/80 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
              Small-batch coffee, roasted within 48 hours of shipping. From bean to cup, with intention.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gold hover:bg-gold-light text-brown-deep h-14 px-8 rounded-none font-medium tracking-wide">
                <Link to="/shop">Shop Coffee <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-none border-cream/40 bg-transparent text-cream hover:bg-cream hover:text-brown-deep">
                <Link to="/story">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-border/60">
        <div className="container-wide py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {[
            { icon: Truck, title: "Free shipping over $50", text: "Roasted-to-order, shipped fast" },
            { icon: Leaf, title: "Direct trade", text: "Sourced ethically, paid fairly" },
            { icon: Award, title: "Award-winning", text: "Specialty grade 85+ coffees" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4 justify-center md:justify-start">
              <f.icon className="h-6 w-6 text-accent" />
              <div>
                <p className="font-medium text-sm">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-wide py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">Featured</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium">This season's selection</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-medium link-underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* STORY */}
      <section className="bg-secondary/40">
        <div className="container-wide py-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={story} alt="Our roastery" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="eyebrow mb-4">Our Craft</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight mb-6 text-balance">
              Coffee, roasted with the patience it deserves.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every bean we roast is sourced through long-standing relationships with growers across Ethiopia, Colombia, Guatemala, and Indonesia. We pay above Fair Trade prices because exceptional coffee deserves exceptional treatment — at every step.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our master roaster develops each profile by hand, in batches no larger than 12kg. Nothing leaves our roastery until it's perfect.
            </p>
            <Button asChild variant="outline" className="rounded-none h-12 border-foreground/30">
              <Link to="/story">Read our story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container-wide py-24">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Loved by thousands</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium">Bestsellers</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-brown-deep text-cream">
        <div className="container-tight py-24 text-center">
          <p className="eyebrow mb-6">— Words from the cup</p>
          <div className="min-h-[180px] flex items-center justify-center">
            <div key={t} className="animate-fade-in">
              <p className="font-display text-2xl md:text-4xl leading-snug max-w-3xl mx-auto text-balance">
                "{testimonials[t].quote}"
              </p>
              <p className="mt-8 text-sm text-cream/70">
                <span className="text-gold font-medium">{testimonials[t].author}</span> · {testimonials[t].role}
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-center mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setT(i)}
                className={`h-px w-10 transition-all ${i === t ? "bg-gold w-16" : "bg-cream/30"}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-tight py-24 text-center">
        <p className="eyebrow mb-4">Join the ritual</p>
        <h2 className="font-display text-4xl md:text-5xl font-medium mb-4 text-balance">
          New roasts. Brewing tips. Members-only drops.
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Subscribe and get <span className="text-accent font-medium">10% off</span> your first order with code WELCOME10.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Welcome to BrewCraft. Use WELCOME10 at checkout."); }}
          className="flex max-w-md mx-auto gap-2"
        >
          <Input type="email" required placeholder="your@email.com" className="h-12 rounded-none border-foreground/20" />
          <Button type="submit" className="h-12 rounded-none bg-foreground text-background hover:bg-foreground/90 px-6">
            Subscribe
          </Button>
        </form>
      </section>
    </>
  );
}
