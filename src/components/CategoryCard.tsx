import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
}

const CategoryCard = ({ id, name, description, imageUrl, productCount = 0 }: CategoryCardProps) => {
  return (
    <Link to={`/categories/${id}`} className="group block">
      <div className="relative h-80 rounded-lg overflow-hidden shadow-elegant transition-all duration-500 group-hover:shadow-gold">
        {/* Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ 
            backgroundImage: imageUrl 
              ? `url(${imageUrl})` 
              : 'linear-gradient(135deg, hsl(43, 74%, 47%) 0%, hsl(35, 80%, 40%) 100%)'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
            <span className="text-xs text-gold-300 tracking-widest uppercase mb-2 block">
              {productCount} Products
            </span>
            <h3 className="font-display text-2xl font-bold text-gold-50 mb-2">
              {name}
            </h3>
            {description && (
              <p className="text-gold-100/70 text-sm line-clamp-2 mb-3">
                {description}
              </p>
            )}
            <div className="flex items-center text-gold-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Explore
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
        
        {/* Border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </Link>
  );
};

export default CategoryCard;
