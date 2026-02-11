import { Button } from "@/components/ui/button";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  badge?: string;
  buttonText?: string;
  onBuy?: () => void;
}

export function ProductCard({ image, title, description, price, badge, buttonText = "Comprar", onBuy }: ProductCardProps) {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden card-interactive">
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
            {badge}
          </span>
        </div>
      )}

      {/* Image container */}
      <div className="relative aspect-square bg-secondary/50 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          <Button variant="hero" size="sm" onClick={onBuy}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
