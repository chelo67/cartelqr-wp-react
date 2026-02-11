import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  business: string;
  rating?: number;
}

export function TestimonialCard({ quote, author, business, rating = 5 }: TestimonialCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 card-interactive">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="text-foreground font-medium mb-4 leading-relaxed">
        "{quote}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{business}</p>
        </div>
      </div>
    </div>
  );
}
