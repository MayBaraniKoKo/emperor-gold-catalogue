import { Wine, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-gold-100">
      {/* Top accent */}
      <div className="h-1 gold-gradient" />
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center">
                <Wine className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-gold-gradient">42 Emperor</span>
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
              <li className="text-gold-200/70 text-sm">Whiskey</li>
              <li className="text-gold-200/70 text-sm">Wine</li>
              <li className="text-gold-200/70 text-sm">Champagne</li>
              <li className="text-gold-200/70 text-sm">Cognac</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold-100 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gold-200/70 text-sm">
                <MapPin className="w-4 h-4 text-gold-400" />
                123 Premium Ave, City
              </li>
              <li className="flex items-center gap-3 text-gold-200/70 text-sm">
                <Phone className="w-4 h-4 text-gold-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-gold-200/70 text-sm">
                <Mail className="w-4 h-4 text-gold-400" />
                info@42emperor.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gold-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gold-200/50 text-sm">
              © 2024 42 Emperor. All rights reserved.
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
