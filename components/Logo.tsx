import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
  siteName?: string;
  onClick?: () => void;
}

const ChitropothIcon: React.FC<{ light?: boolean; size?: string }> = ({ light, size = "1.5em" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: size, width: size }}
    className="mr-2 md:mr-3 flex-shrink-0 transition-all duration-300"
  >
    {/* Background Circle */}
    <circle cx="50" cy="50" r="45" fill="#7AA69F" />
    
    {/* Bottom Wave (Yellow) */}
    <path 
      d="M38 45C30 55 35 85 55 88C35 85 45 60 55 55C65 50 60 40 45 42L38 45Z" 
      fill="#F7E479" 
    />
    
    {/* Top Wave (Coral) */}
    <path 
      d="M62 55C70 45 65 15 45 12C65 15 55 40 45 45C35 50 40 60 55 58L62 55Z" 
      fill="#F5A18C" 
    />
    
    {/* Paintbrush Handle */}
    <rect 
      x="25" y="70" width="60" height="4" rx="2" 
      transform="rotate(-45 25 70)" 
      fill={light ? "#FFFFFF" : "#2D4A43"} 
    />
    
    {/* Paintbrush Tip */}
    <path 
      d="M65 30C68 27 75 25 78 30C81 35 75 42 70 45L65 30Z" 
      fill={light ? "#E5E7EB" : "#F3F4F6"} 
      stroke={light ? "#FFFFFF" : "#2D4A43"} 
      strokeWidth="1"
    />
  </svg>
);

const Logo: React.FC<LogoProps> = ({ 
  className = "h-auto", 
  light = false, 
  siteName: siteNameProp,
  onClick
}) => {
  const [resolvedSiteName, setResolvedSiteName] = useState("CHITROPOTH");

  useEffect(() => {
    if (siteNameProp) {
      setResolvedSiteName(siteNameProp.toUpperCase());
      return;
    }

    fetch('./metadata.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          const name = data.name.split(' - ')[0].toUpperCase();
          setResolvedSiteName(name.includes("CITRO") ? "CHITROPOTH" : name);
        }
      })
      .catch(() => {
        setResolvedSiteName("CHITROPOTH");
      });
  }, [siteNameProp]);

  return (
    <div 
      onClick={onClick}
      className={`flex items-center relative flex-shrink-0 transition-all duration-300 ease-out ${className} ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-95' : ''}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
      aria-label={onClick ? `Go to Home - ${resolvedSiteName}` : undefined}
    >
      <ChitropothIcon light={light} size="1.4em" />
      <span className={`font-serif font-bold select-none whitespace-nowrap leading-none transition-all duration-300
        ${light ? 'text-white' : 'text-stone-900'}
        text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
        tracking-tighter sm:tracking-tight md:tracking-normal
      `}>
        {resolvedSiteName === "CHITROPOTH" ? (
          <>CHITRO<span className="text-[#F5A18C]">POTH</span></>
        ) : (
          resolvedSiteName
        )}
      </span>
    </div>
  );
};

export default Logo;