import React from 'react';
import { PlayCircle } from 'lucide-react';

interface PremiumLoadingProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const PremiumLoading: React.FC<PremiumLoadingProps> = ({
  title = "Loading",
  subtitle = "Please wait while we prepare your experience",
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-surface ${className}`}>
      <div className="glass rounded-3xl shadow-premium p-12 text-center border border-border/20 max-w-md mx-4">
        {/* Premium Loading Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-premium animate-pulse-glow">
            <PlayCircle className="w-10 h-10 text-primary-foreground animate-pulse" />
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-primary/20 rounded-full animate-spin">
              <div className="w-3 h-3 bg-primary rounded-full absolute -top-1.5 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-primary/10 rounded-full animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}>
              <div className="w-2 h-2 bg-primary-light rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-lg leading-relaxed">{subtitle}</p>
        
        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-primary rounded-full animate-pulse loading-progress"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoading;