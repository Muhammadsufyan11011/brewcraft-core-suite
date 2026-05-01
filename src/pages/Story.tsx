import story from "@/assets/story.jpg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Story() {
  return (
    <>
      <section className="container-tight pt-20 pb-12 text-center">
        <p className="eyebrow mb-6">Our Story</p>
        <h1 className="font-display text-5xl md:text-7xl font-medium leading-[1.05] text-balance max-w-3xl mx-auto">
          A roastery built on patience, relationships, and the perfect cup.
        </h1>
      </section>
      <section className="container-wide">
        <div className="aspect-[16/9] overflow-hidden">
          <img src={story} alt="Our roastery" className="w-full h-full object-cover" />
        </div>
      </section>
      <section className="container-tight py-20 prose prose-lg max-w-2xl mx-auto">
        <p className="text-lg leading-relaxed text-muted-foreground">
          BrewCraft Co. began in 2014 with a single drum roaster in a 400-square-foot garage in Portland, Oregon. Our founder, having spent a decade traveling between coffee farms in Ethiopia and Colombia, returned with one conviction: extraordinary coffee deserves an extraordinary roast.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground mt-6">
          A decade later, we still roast every batch by hand. We still source through direct relationships with the same growers. And we still ship every order within 48 hours of roasting — because freshness isn't a marketing claim. It's the whole point.
        </p>
        <div className="text-center mt-12">
          <Button asChild className="rounded-none h-12 px-8 bg-foreground text-background hover:bg-foreground/90">
            <Link to="/shop">Shop our coffee</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
