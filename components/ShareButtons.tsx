
import React from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    { 
      name: 'Facebook', 
      icon: 'fa-facebook-f', 
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      brandClass: 'hover:text-[#1877F2] hover:border-[#1877F2]'
    },
    { 
      name: 'Twitter', 
      icon: 'fa-x-twitter', 
      link: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      brandClass: 'hover:text-black hover:border-black'
    },
    { 
      name: 'Pinterest', 
      icon: 'fa-pinterest-p', 
      link: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      brandClass: 'hover:text-[#BD081C] hover:border-[#BD081C]'
    },
    { 
      name: 'Email', 
      icon: 'fa-envelope', 
      link: `mailto:?subject=${encodedTitle}&body=I thought you might like this piece from Citropoth: ${url}`,
      brandClass: 'hover:text-[#F5A18C] hover:border-[#F5A18C]'
    }
  ];

  return (
    <div className="flex items-center space-x-5">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Share this story:</span>
      <div className="flex space-x-3">
        {shareLinks.map((share) => (
          <a
            key={share.name}
            href={share.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 transition-all duration-300 ${share.brandClass} hover:shadow-sm`}
            title={`Share on ${share.name}`}
          >
            {share.name === 'Email' ? (
              <i className={`fa-solid ${share.icon} text-xs`}></i>
            ) : (
              <i className={`fa-brands ${share.icon} text-xs`}></i>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShareButtons;
