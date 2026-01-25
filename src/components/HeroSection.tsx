import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg?url";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <span className="inline-block px-4 py-2 mb-6 text-xs tracking-[0.3em] uppercase text-gold-400 border border-gold-500/30 rounded-full">
            Premium Spirits Collection
          </span>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gold-50 mb-6 leading-tight">
            <span className="text-gold-gradient">United</span> 42
          </h1>
          
          <p className="text-lg md:text-xl text-gold-100/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Discover an exquisite selection of the world's finest spirits. 
            From rare whiskeys to premium wines, curated for the discerning palate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="gold-gradient text-primary-foreground px-8 py-6 text-base font-medium shadow-gold hover:opacity-90 transition-opacity">
                Explore Collection
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="outline" className="border-gold-400/50 text-gold-400 hover:bg-gold-500/10 px-8 py-6 text-base">
                View Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold-400/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gold-400 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
