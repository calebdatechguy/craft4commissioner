import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  heroImage?: {
    url: string;
    altText: string;
    layoutConstraints: {
      maxWidth: string;
      maxHeight: string;
      objectFit: "cover" | "contain" | "fill" | "none" | "scale-down";
    };
  };
  variant?: 'homepage' | 'standard';
  className?: string;
  showLogo?: boolean;
}

/**
 * Reusable Hero component with customizable background and gradient overlays.
 * Supports a special 'homepage' variant with a left-to-right gradient fade.
 */
const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  backgroundImage = "https://images.unsplash.com/photo-1541872703-74c5e443d1f5?q=80&w=2000&auto=format&fit=crop", // Default patriotic/government placeholder
  heroImage,
  variant = 'standard',
  className,
  showLogo = false
}) => {
  const isHomepage = variant === 'homepage';

  const finalBackgroundImage = heroImage?.url || backgroundImage;

  return (
    <section className={cn(
      "relative overflow-hidden flex items-center border-none",
      isHomepage ? "min-h-[70vh] md:min-h-[85vh] bg-blue-900" : "bg-blue-900 py-20 md:py-32",
      className
    )}>
      {/* Background Image Container */}
      {!isHomepage && (
        <div
          className={cn(
            "absolute inset-0 z-0 flex items-center",
            "justify-center"
          )}>

          <img
            src={finalBackgroundImage}
            alt={heroImage?.altText || "Campaign Hero Image"}
            className={cn(
              "w-full h-full",
              !heroImage ? "object-cover" : ""
            )}
            style={heroImage ? {
              maxWidth: heroImage.layoutConstraints.maxWidth,
              maxHeight: heroImage.layoutConstraints.maxHeight,
              objectFit: heroImage.layoutConstraints.objectFit
            } : undefined} />

        </div>
      )}

      {/* Gradient Overlay */}
      {isHomepage ?
      // Specific blue fade for homepage: uniform overlay for better text contrast
      <div 
        className="absolute inset-0 z-10 border-none bg-blue-900/60 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.6), rgba(30, 58, 138, 0.6)), url('https://cdn.craft4commissioner.com/img/EricWebsitePics-2.avif')`
        }}
      /> :

      // Standard hero overlay (uniform dark overlay)
      <div className="absolute inset-0 z-10 border-none bg-blue-900/80" />
      }

      <div className="container mx-auto px-4 relative z-20">
        <div className={cn(
          "max-w-4xl",
          !isHomepage && "text-center mx-auto"
        )}>
          {showLogo &&
          <div className={cn("mb-8", !isHomepage && "flex justify-center")}>
              <img
              src="https://cdn.craft4commissioner.com/img/Artboard%201_1%4072x.webp"
              alt="Eric Craft for Barrow"
              className="h-24 md:h-32 w-auto object-contain brightness-0 invert" />

            </div>
          }

          {subtitle &&
          <h2 className="text-blue-200 font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
              {subtitle}
            </h2>
          }
          
          <h1 className={cn(
            "font-extrabold mb-6 leading-tight text-white",
            isHomepage ? "text-4xl md:text-6xl lg:text-7xl" : "text-4xl md:text-5xl lg:text-6xl"
          )}>
            {title}
          </h1>
          
          {description &&
          <p className={cn(
            "text-lg md:text-xl text-blue-50 mb-8 max-w-2xl",
            !isHomepage && "mx-auto"
          )}>
              {description}
            </p>
          }

          <div className={cn(
            "flex flex-col sm:flex-row gap-4",
            !isHomepage && "justify-center"
          )}>
            {ctaText && ctaLink && (
              ctaLink.startsWith('http') ? (
                <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-white text-blue-900 hover:bg-blue-200 font-bold text-lg px-10 py-7 transition-colors">
                    {ctaText}
                  </Button>
                </a>
              ) : (
                <Link to={ctaLink}>
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-200 font-bold text-lg px-10 py-7 transition-colors">
                    {ctaText}
                  </Button>
                </Link>
              )
            )}
            
            {secondaryCtaText && secondaryCtaLink && (
              secondaryCtaLink.startsWith('http') ? (
                <a href={secondaryCtaLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="lg" variant="destructive" className="w-full bg-red-600 hover:bg-red-700 font-bold text-lg px-10 py-7 transition-all">
                    {secondaryCtaText}
                  </Button>
                </a>
              ) : (
                <Link to={secondaryCtaLink}>
                  <Button size="lg" variant="destructive" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 font-bold text-lg px-10 py-7 transition-all">
                    {secondaryCtaText}
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default React.memo(Hero);