import { Wine, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logoUrl from "@/assets/United42.jpg";
import { useCategories } from "@/hooks/useCategories";

const Footer = () => {
  const { data: categories } = useCategories();
  return (
    <footer className="bg-foreground text-gold-100">
      {/* Top accent */}
      <div className="h-1 gold-gradient" />
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="United 42 logo" className="w-10 h-10 rounded-full object-cover shadow-gold" />
            <span className="font-display text-xl font-bold text-gold-gradient">United 42</span>
            </div>
            <p className="text-gold-200/70 text-sm leading-relaxed">
              Your premier destination for the world's finest spirits. 
              Curated excellence since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold-100 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gold-200/70 hover:text-gold-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gold-200/70 hover:text-gold-400 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gold-200/70 hover:text-gold-400 transition-colors text-sm">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold-100 mb-6">Categories</h4>
            <ul className="space-y-3">
              {categories && categories.length > 0 ? (
                categories.slice(0, 4).map((category) => (
                  <li key={category.id} className="text-gold-200/70 text-sm">
                    {category.name}
                  </li>
                ))
              ) : (
                <li className="text-gold-200/70 text-sm">Loading...</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold-100 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gold-200/70 text-sm">
                <Phone className="w-4 h-4 text-gold-400" />
                09 88171 42 42 <br/>
                09 761 42 42 42 <br/>
                09 978 42 42 42 <br/>
              </li>
              <li className="flex items-center gap-3 text-gold-200/70 text-sm">
                <Mail className="w-4 h-4 text-gold-400" />
                united424242@gmail.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gold-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gold-200/50 text-sm">
              © 2026 United 42. All rights reserved.
            </p>
            <p className="text-gold-200/50 text-xs">
              Please drink responsibly. Must be 21+ to purchase.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
