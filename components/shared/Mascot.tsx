import React, { useState } from 'react';

// Using a general props interface that covers common attributes like className and onClick.
// This avoids type conflicts between <img> and <svg> specific attributes.
interface MascotProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ className = '', ...props }) => {
  const [hasError, setHasError] = useState(false);

  // If the PNG has failed to load, render the fallback SVG.
  if (hasError) {
    return (
      <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        // FIX: Cast props to `unknown` then to `SVGProps` to resolve type incompatibility for the SVG fallback.
        {...(props as unknown as React.SVGProps<SVGSVGElement>)}
      >
        <title>Glowy the mascot</title>
        <defs>
          <radialGradient id="glowyGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: '#FDE2F3'}} />
            <stop offset="70%" style={{stopColor: '#E5BEEC'}} />
            <stop offset="100%" style={{stopColor: '#917FB3'}} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#glowyGradient)" />
        <g fill="#2A2F4F">
          <circle cx="38" cy="45" r="5" />
          <circle cx="62" cy="45" r="5" />
          <path 
            d="M 40 60 Q 50 72 60 60" 
            stroke="#2A2F4F" 
            strokeWidth="3.5" 
            fill="none" 
            strokeLinecap="round" 
          />
        </g>
      </svg>
    );
  }

  // By default, try to render the PNG image.
  // The onError handler will trigger the fallback to SVG if the image doesn't load.
  // This assumes mascot.png would be placed in a /public/images/ directory.
  return (
    <img
      src="/images/mascot.png"
      alt="Glowy the mascot"
      className={className}
      onError={() => setHasError(true)}
      {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
};

export default Mascot;