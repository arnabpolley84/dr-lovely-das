import React, { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  objectPosition?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = "",
  containerClassName = "",
  aspectRatioClass = "",
  objectPosition = "center center",
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-100 to-teal-50/40 flex items-center justify-center p-6 text-slate-400 ${containerClassName} ${aspectRatioClass}`}
        role="img"
        aria-label={alt}
      >
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-teal-100/60 text-teal-700 flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <span className="text-xs font-medium text-slate-600 tracking-wide uppercase">
            Specialist Care · Mukundapur
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${containerClassName} ${aspectRatioClass}`}
    >
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        referrerPolicy="no-referrer"
        loading="lazy"
        style={{ objectPosition }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-slate-100 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
