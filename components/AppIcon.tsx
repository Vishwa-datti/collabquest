
import React from 'react';

interface AppIconProps {
  className?: string;
  size?: number | string;
}

export const AppIcon: React.FC<AppIconProps> = ({ className = "", size = 40 }) => {
  return (
    <div className={`transition-transform duration-700 hover:[transform:rotateY(360deg)] cursor-pointer animate-float-3d perspective-container ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Shape 1 - Representing Person/Node 1 */}
        <rect 
          x="15" 
          y="25" 
          width="50" 
          height="50" 
          rx="14" 
          fill="#4F46E5" 
          fillOpacity="0.9"
        />
        
        {/* Background Shape 2 - Representing Person/Node 2 (Interlocking) */}
        <rect 
          x="35" 
          y="25" 
          width="50" 
          height="50" 
          rx="14" 
          fill="#0D9488" 
          fillOpacity="0.8"
        />
        
        {/* Intersecting Area Highlight */}
        <path 
          d="M35 39C35 31.268 41.268 25 49 25V75C41.268 75 35 68.732 35 61V39Z" 
          fill="white" 
          fillOpacity="0.2"
        />
        
        {/* Subtle AI "Spark" - Representing Intelligence/Guidance */}
        <path 
          d="M50 42L52 48L58 50L52 52L50 58L48 52L42 50L48 48L50 42Z" 
          fill="#FDE047"
          className="animate-pulse"
        />
        
        {/* Node connectors - subtle lines suggesting a network */}
        <circle cx="25" cy="35" r="2.5" fill="white" fillOpacity="0.5" />
        <circle cx="75" cy="65" r="2.5" fill="white" fillOpacity="0.5" />
      </svg>
    </div>
  );
};
