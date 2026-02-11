import { ReactNode } from "react";

interface StepCardProps {
  step: number;
  icon: ReactNode;
  title: string;
  description: string;
}

export function StepCard({ step, icon, title, description }: StepCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center p-6 group">
      {/* Step number badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
        {step}
      </div>
      
      {/* Icon container */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-5 mt-4 group-hover:scale-110 transition-transform duration-300">
        <div className="text-primary">
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}
