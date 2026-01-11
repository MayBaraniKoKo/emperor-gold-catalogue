import { Link, useNavigate } from "react-router-dom";
import { Wine, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center shadow-gold">
              <Wine className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-gold-gradient">42 Emperor</span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">Premium Spirits</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Categories
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                    <User className="w-4 h-4 mr-2" />
                    CMS
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
