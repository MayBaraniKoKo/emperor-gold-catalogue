import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Wine, Layers, Package, Home, LogOut } from "lucide-react";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import SubcategoriesAdmin from "@/components/admin/SubcategoriesAdmin";
import ProductsAdmin from "@/components/admin/ProductsAdmin";

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("categories");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center shadow-gold">
                <Wine className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-gold-gradient">42 Emperor</span>
                <span className="block text-xs text-muted-foreground">Content Management</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Content Management System
          </h1>
          <p className="text-muted-foreground">
            Manage your categories, subcategories, and products.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-secondary">
            <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Layers className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="subcategories" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Layers className="w-4 h-4" />
              Subcategories
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoriesAdmin />
          </TabsContent>

          <TabsContent value="subcategories">
            <SubcategoriesAdmin />
          </TabsContent>

          <TabsContent value="products">
            <ProductsAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
