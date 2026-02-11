import { Check } from "lucide-react";

interface BenefitItemProps {
  text: string;
}

export function BenefitItem({ text }: BenefitItemProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-card hover:bg-card-hover transition-colors duration-200">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-primary-foreground" />
      </div>
      <span className="text-foreground font-medium">{text}</span>
    </div>
  );
}
