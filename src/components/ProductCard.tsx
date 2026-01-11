import { Star, Wine } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  alcoholPercentage?: number | null;
  volumeMl?: number | null;
  originCountry?: string | null;
  isFeatured?: boolean;
  inStock?: boolean;
}

const ProductCard = ({ 
  name, 
  description, 
  price, 
  imageUrl, 
  alcoholPercentage,
  volumeMl,
  originCountry,
  isFeatured,
  inStock = true 
}: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-elegant transition-all duration-300 hover:shadow-gold hover:-translate-y-1">
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 gold-gradient rounded-full">
          <Star className="w-3 h-3 text-primary-foreground fill-current" />
          <span className="text-xs font-medium text-primary-foreground">Featured</span>
        </div>
      )}

      {/* Out of stock badge */}
      {!inStock && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-destructive rounded-full">
          <span className="text-xs font-medium text-destructive-foreground">Out of Stock</span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-64 bg-secondary overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center gold-gradient opacity-30">
            <Wine className="w-16 h-16 text-primary-foreground" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2">
            {name}
          </h3>
          <span className="font-display text-xl font-bold text-gold-gradient whitespace-nowrap">
            ${price.toFixed(2)}
          </span>
        </div>

        {description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {volumeMl && (
            <span className="px-2 py-1 bg-secondary rounded">
              {volumeMl}ml
            </span>
          )}
          {alcoholPercentage && (
            <span className="px-2 py-1 bg-secondary rounded">
              {alcoholPercentage}% ABV
            </span>
          )}
          {originCountry && (
            <span className="px-2 py-1 bg-secondary rounded">
              {originCountry}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 gold-gradient transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
};

export default ProductCard;
