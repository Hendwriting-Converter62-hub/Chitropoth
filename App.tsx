
import React, { useState, useEffect, useRef } from 'react';
import { Page, Product, BlogPost, CartItem, User, Review, Order } from './types.ts';
import { MOCK_PRODUCTS, MOCK_BLOGS } from './constants.tsx';
import Layout from './components/Layout.tsx';
import ReviewSection from './components/ReviewSection.tsx';
import ShareButtons from './components/ShareButtons.tsx';
import { getCraftRecommendation, generateProductStory } from './services/geminiService.ts';

// --- Sub-components ---

const QuickViewModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onViewDetails: (id: string) => void;
}> = ({ product, onClose, onAddToCart, onViewDetails }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-stone-500 hover:text-stone-900 shadow-md transition-all"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-auto bg-stone-100 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5A18C] mb-2 block">{product.category}</span>
          <h2 className="text-2xl md:text-3xl font-serif mb-4 leading-tight">{product.name}</h2>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-light text-stone-900">${product.price.toFixed(2)}</span>
            <div className="flex text-amber-500 text-xs">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-stone-200'}`}></i>
              ))}
            </div>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed mb-8 line-clamp-4">
            {product.description}
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              className="w-full bg-stone-900 text-white py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-stone-800 transition-all shadow-lg transform active:scale-[0.98]"
            >
              ADD TO BAG
            </button>
            <button 
              onClick={() => { onViewDetails(product.id); onClose(); }}
              className="w-full border border-stone-200 text-stone-600 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-all"
            >
              VIEW FULL STORY
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

const FeaturedCarousel: React.FC<{ 
  products: Product[], 
  onSelectProduct: (id: string) => void 
}> = ({ products, onSelectProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = products.slice(0, 5); 
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-stone-50 overflow-hidden border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-16">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-2 italic">Artisan Spotlight</h3>
            <p className="text-stone-500 uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold">The most coveted pieces from our master craftsmen</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-stone-400"
              aria-label="Previous slide"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </button>
            <button 
              onClick={nextSlide}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-stone-400"
              aria-label="Next slide"
            >
              <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featured.map((product) => (
              <div key={product.id} className="w-full flex-shrink-0 px-1 sm:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl lg:shadow-2xl bg-stone-200">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                    <span className="text-[#F5A18C] font-bold tracking-widest text-[10px] md:text-xs uppercase">{product.category}</span>
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 leading-tight">{product.name}</h4>
                    <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3 md:line-clamp-none max-w-xl mx-auto lg:mx-0">
                      {product.description}
                    </p>
                    <div className="flex items-baseline justify-center lg:justify-start space-x-4">
                      <span className="text-2xl sm:text-3xl font-light text-stone-900">${product.price.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => onSelectProduct(product.id)}
                      className="w-full sm:w-auto bg-stone-900 text-white px-8 md:px-10 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#F5A18C] transition-all inline-block rounded-sm shadow-md"
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 md:mt-12 space-x-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${currentIndex === i ? 'w-6 md:w-8 bg-[#F5A18C]' : 'w-1.5 md:w-2 bg-stone-300 hover:bg-stone-400'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const HomeView: React.FC<{ 
  onSetPage: (p: Page) => void, 
  products: Product[], 
  onAddToCart: (p: Product) => void,
  onSelectProduct: (id: string) => void,
  aiTip: string,
  isAiLoading: boolean,
  onRefreshTip: () => void
}> = ({ onSetPage, products, onAddToCart, onSelectProduct, aiTip, isAiLoading, onRefreshTip }) => (
  <div className="animate-in fade-in duration-700">
    {/* Hero Section */}
    <section className="relative h-[70vh] sm:h-[60vh] md:h-[75vh] lg:h-[85vh] flex items-center bg-stone-100 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50">
        <img 
          src="https://images.unsplash.com/photo-1459749411177-0421800673e6?auto=format&fit=crop&q=80&w=1600" 
          alt="Craft Background" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center lg:text-left">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <span className="text-[#F5A18C] font-bold tracking-[0.3em] text-[10px] sm:text-xs mb-4 block uppercase animate-in slide-in-from-bottom-2 duration-700">The Handcrafted Collection</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight animate-in slide-in-from-bottom-4 duration-700">Elevate your home with <span className="italic">soulful</span> objects.</h2>
          <p className="text-stone-700 text-sm sm:text-base md:text-lg lg:text-xl mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-in slide-in-from-bottom-6 duration-700">
            Discover unique pieces created by master artisans who value tradition, sustainability, and exceptional design.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in slide-in-from-bottom-8 duration-700">
            <button 
              onClick={() => onSetPage(Page.Shop)}
              className="w-full sm:w-auto bg-stone-900 text-white px-8 md:px-10 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest hover:bg-stone-800 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              SHOP THE COLLECTION
            </button>
            <button 
              onClick={() => onSetPage(Page.Blog)}
              className="w-full sm:w-auto border border-stone-900 text-stone-900 px-8 md:px-10 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest hover:bg-stone-900 hover:text-white transition-all transform hover:-translate-y-1"
            >
              OUR STORY
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* AI Assistant Section */}
    <section className="py-12 md:py-20 bg-stone-100/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-block p-2 bg-white rounded-full mb-6 shadow-sm">
          <i className="fa-solid fa-wand-magic-sparkles text-[#F5A18C] px-2"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D4A43] pr-3 border-r border-stone-100 mr-2">AI Craft Assistant</span>
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif mb-6">Seeking a spark for your next project?</h3>
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-stone-100 transform transition-transform hover:scale-[1.01]">
          {isAiLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-stone-300 rounded-full"></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
                <div className="w-2 h-2 bg-stone-500 rounded-full"></div>
              </div>
            </div>
          ) : (
            <p className="text-stone-700 text-base sm:text-lg md:text-xl leading-relaxed italic">
              "{aiTip || "Discover the hidden beauty in everyday textures. Why not try working with natural fibers today?"}"
            </p>
          )}
          <button 
            onClick={onRefreshTip}
            className="mt-6 text-[#F5A18C] text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-amber-700 transition-colors flex items-center justify-center mx-auto"
          >
            New Inspiration <i className="fa-solid fa-rotate-right ml-2 text-[10px]"></i>
          </button>
        </div>
      </div>
    </section>

    {/* Departments Grid */}
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="text-2xl sm:text-3xl font-serif mb-10 md:mb-16 text-center">Curated Departments</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {['Ceramics', 'Textiles', 'Paintings', 'Jewelry'].map((cat) => (
          <div 
            key={cat} 
            onClick={() => onSetPage(Page.Shop)}
            className="group cursor-pointer relative overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-xl shadow-md"
          >
            <img 
              src={`https://picsum.photos/seed/${cat}/600/800`} 
              alt={cat} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent group-hover:from-stone-900/80 transition-all"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h4 className="text-white text-xl sm:text-2xl font-serif mb-1">{cat}</h4>
              <span className="text-white/80 text-[10px] uppercase tracking-widest opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">Explore Department</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Featured Carousel */}
    <FeaturedCarousel 
      products={products} 
      onSelectProduct={onSelectProduct} 
    />
  </div>
);

const ShopView: React.FC<{ 
  products: Product[], 
  onSelectProduct: (id: string) => void,
  onQuickView: (id: string) => void
}> = ({ products, onSelectProduct, onQuickView }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
    <div className="mb-8 md:mb-12 border-b border-stone-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="max-w-xl">
        <h2 className="text-3xl md:text-4xl font-serif mb-2">The Collection</h2>
        <p className="text-stone-500 text-sm sm:text-base">Explore a range of handmade goods, from tactile ceramics to soulful textiles, all crafted with intention.</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        <select className="flex-grow md:flex-initial bg-white border border-stone-200 p-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-stone-400 outline-none cursor-pointer rounded">
          <option>All Categories</option>
          <option>Ceramics</option>
          <option>Textiles</option>
          <option>Paintings</option>
          <option>Jewelry</option>
        </select>
      </div>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-16">
      {products.map((product) => (
        <div key={product.id} className="group cursor-pointer relative" onClick={() => onSelectProduct(product.id)}>
          <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-stone-100 rounded-xl shadow-sm">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-all flex items-center justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); onQuickView(product.id); }}
                className="bg-white text-stone-900 px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#F5A18C] hover:text-white"
              >
                Quick View
              </button>
            </div>
            {product.isLimited && (
              <div className="absolute top-4 left-4 bg-[#F7E479] text-stone-900 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                Limited Release
              </div>
            )}
          </div>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1 font-bold">{product.category}</p>
          <h4 className="font-serif text-base sm:text-lg mb-1 group-hover:text-[#F5A18C] transition-colors line-clamp-1">{product.name}</h4>
          <span className="font-medium text-stone-900 text-sm sm:text-base">${product.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  </div>
);

const LimitedReleasesView: React.FC<{ 
  products: Product[], 
  onSelectProduct: (id: string) => void,
  onQuickView: (id: string) => void
}> = ({ products, onSelectProduct, onQuickView }) => {
  const limitedItems = products.filter(p => p.isLimited);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-3xl mb-12 md:mb-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#F5A18C] mb-4 block">Exclusive Drops</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">Limited Releases</h2>
        <p className="text-stone-500 text-base md:text-lg leading-relaxed">Rare, soulful treasures crafted in small batches. Once these pieces find their home, they may never return to our studio archives.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
        {limitedItems.map((product) => (
          <div key={product.id} className="group cursor-pointer relative" onClick={() => onSelectProduct(product.id)}>
             <div className="relative overflow-hidden aspect-[16/9] mb-6 bg-stone-100 rounded-3xl shadow-xl">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/10 transition-all"></div>
               <div className="absolute bottom-8 left-8">
                 <span className="bg-[#F7E479] text-stone-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                   Rare Acquisition
                 </span>
               </div>
             </div>
             <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                   <div>
                     <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1 font-bold">{product.category}</p>
                     <h3 className="font-serif text-2xl sm:text-3xl group-hover:text-[#F5A18C] transition-colors leading-tight">{product.name}</h3>
                   </div>
                   <span className="font-light text-stone-900 text-xl sm:text-2xl">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 max-w-xl mb-6">{product.description}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); onQuickView(product.id); }}
                  className="text-[10px] font-black uppercase tracking-widest border-b-2 border-stone-900 pb-1 hover:text-[#F5A18C] hover:border-[#F5A18C] transition-all"
                >
                  SECURE THIS PIECE
                </button>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-24 p-12 md:p-20 bg-stone-900 text-white rounded-[3rem] text-center overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1544413647-b51049300985?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover" />
         </div>
         <div className="relative z-10">
           <h3 className="text-3xl md:text-4xl font-serif mb-6 text-[#F7E479]">Future Masterpieces</h3>
           <p className="max-w-2xl mx-auto text-stone-400 mb-10 leading-relaxed">We release only 4 limited collections per year. Join our mailing list to receive the private link to the studio 24 hours before public release.</p>
           <button className="bg-[#F5A18C] text-white px-10 py-4 text-xs font-black uppercase tracking-[0.3em] rounded-xl shadow-2xl hover:bg-[#e08b76] transition-all">JOIN THE INNER CIRCLE</button>
         </div>
      </div>
    </div>
  );
};

const MastersView: React.FC = () => {
  const masters = [
    {
      name: 'Elena Vance',
      specialty: 'Master Ceramist',
      bio: 'With over 30 years of quiet practice in her seaside studio, Elena creates forms that echo the balance of nature. Her "Midnight Glaze" is a closely guarded family secret.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      quote: "The clay remembers every breath of the artist."
    },
    {
      name: 'Liam Rivers',
      specialty: 'Textile Alchemist',
      bio: 'Liam bridges the gap between ancient weaving techniques and modern sustainable dyeing. His tapestries are found in the most intentional homes across Europe.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
      quote: "Every thread tells a story of the earth it came from."
    },
    {
      name: 'Maya Chen',
      specialty: 'Contemporary Painter',
      bio: 'Maya’s landscapes aren’t just visual; they are emotional journals. She uses pigments found in the local forests of her mountain home to create ethereal depth.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600',
      quote: "Color is the language of the soul when words fail."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#F5A18C] mb-4 block">The Hands Behind the Craft</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">Meet the Masters</h2>
        <p className="text-stone-500 text-base md:text-lg leading-relaxed">At Citropoth, we don't just sell objects; we represent lineages of skill and decades of dedication. Meet the artisans who define our collection.</p>
      </div>

      <div className="space-y-32">
        {masters.map((master, idx) => (
          <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
            <div className="w-full lg:w-1/2 aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative group">
              <img src={master.image} alt={master.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-all"></div>
            </div>
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5A18C]">{master.specialty}</span>
              <h3 className="text-4xl sm:text-5xl font-serif text-stone-900 leading-tight">{master.name}</h3>
              <p className="text-stone-600 text-lg leading-relaxed">{master.bio}</p>
              <div className="pt-6">
                <p className="text-xl sm:text-2xl font-serif italic text-stone-400 leading-relaxed">"{master.quote}"</p>
              </div>
              <div className="pt-8">
                <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-stone-900 pb-1 hover:text-[#F5A18C] hover:border-[#F5A18C] transition-all">
                  EXPLORE {master.name.split(' ')[0].toUpperCase()}'S WORK
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 p-12 bg-stone-100 rounded-[3rem] text-center border border-stone-200">
         <h3 className="text-2xl font-serif mb-4">Are you a Master Artisan?</h3>
         <p className="text-stone-500 mb-8 max-w-xl mx-auto">We are always seeking soulful creators who align with our values of sustainability and timeless design.</p>
         <button className="bg-stone-900 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#2D4A43] transition-all">SUBMIT YOUR PORTFOLIO</button>
      </div>
    </div>
  );
};

const EthicalSourcingView: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 animate-in fade-in duration-500">
    <div className="text-center mb-16">
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5A18C] mb-4 block">A Legacy of Integrity</span>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8">Ethical Sourcing</h1>
      <p className="text-stone-500 text-lg leading-relaxed max-w-2xl mx-auto italic">"Every object we curate is a testament to the hands that made it and the earth that provided the materials."</p>
    </div>

    <div className="space-y-16">
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-sm">
         <h2 className="text-2xl font-serif mb-6 text-stone-900">The Master's Wage</h2>
         <p className="text-stone-600 leading-loose mb-6">At Citropoth, we bypass the industrial scale to deal directly with independent master artisans. We don't negotiate prices down; we ask the artist for their valuation and respect it. This ensures every piece supports a life of dignity and continued creative practice.</p>
         <div className="h-px bg-stone-100 w-24"></div>
      </section>

      <section className="bg-stone-900 text-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5A18C] rounded-full blur-[80px] opacity-20"></div>
         <h2 className="text-2xl font-serif mb-6 text-[#F7E479]">Material Wisdom</h2>
         <p className="text-stone-400 leading-loose mb-6">From the clay gathered in local riverbeds to the natural indigo grown in community gardens, our collection prioritizes Earth-first materials. We strictly forbid the use of endangered woods, toxic dyes, or unsustainable plastic derivatives in any product carrying the Citropoth seal.</p>
      </section>

      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-sm">
         <h2 className="text-2xl font-serif mb-6 text-stone-900">Radical Transparency</h2>
         <p className="text-stone-600 leading-loose mb-6">We believe you have the right to know the full journey of your acquisition. In our artisan journal, we document the workshops, the methods, and the environmental impact of our supply chain. No secrets—just soulful craft.</p>
         <div className="mt-8 flex gap-4">
            <span className="px-3 py-1 rounded-full bg-stone-50 border border-stone-100 text-[9px] font-black uppercase tracking-widest text-stone-400">Fair Trade</span>
            <span className="px-3 py-1 rounded-full bg-stone-50 border border-stone-100 text-[9px] font-black uppercase tracking-widest text-stone-400">Eco-Positive</span>
            <span className="px-3 py-1 rounded-full bg-stone-50 border border-stone-100 text-[9px] font-black uppercase tracking-widest text-stone-400">Handcrafted Only</span>
         </div>
      </section>
    </div>
  </div>
);

const JourneyLogisticsView: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 animate-in fade-in duration-500 prose prose-stone">
    <h1 className="font-serif text-4xl mb-8">Journey Logistics</h1>
    <p className="text-lg text-stone-600 mb-8 italic">Artisanal objects require a different kind of movement—one of care, precision, and patience.</p>
    
    <section className="mb-12">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-6">1. Preparation of the Piece</h2>
      <p>Before leaving our studio, every object undergoes a final inspection by a master curator. We then wrap your acquisition in 100% biodegradable and recycled materials, ensuring its safety while honoring our commitment to the Earth.</p>
    </section>

    <section className="mb-12">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-6">2. Timelines of Craft</h2>
      <p>Because we do not use mass-distribution hubs, standard transit takes between 5-7 business days within Bangladesh. International journeys are mapped individually and typically span 14-21 days.</p>
    </section>

    <section className="mb-12">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-6">3. Real-time Tracking</h2>
      <p>Once your piece has been entrusted to our logistics partners, you will receive a digital tracking scroll via email. This allows you to follow its journey from the artisan's region to your doorstep.</p>
    </section>
    
    <div className="p-8 bg-stone-100 rounded-2xl flex items-center gap-6">
       <i className="fa-solid fa-truck-fast text-4xl text-[#F5A18C]"></i>
       <p className="text-sm font-medium text-stone-500">Free sustainable shipping is provided for all collections exceeding $150 in value.</p>
    </div>
  </div>
);

const StudioReturnsView: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 animate-in fade-in duration-500 prose prose-stone">
    <h1 className="font-serif text-4xl mb-8">Studio Returns</h1>
    <p className="text-lg text-stone-600 mb-8 italic">Sometimes, the resonance isn't quite right. We facilitate returns with the same grace we use for acquisition.</p>
    
    <section className="mb-12">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-6">Our 14-Day Window</h2>
      <p>You have 14 days from the moment of delivery to decide if the piece belongs in your space. To be eligible for a return, the object must be in its original artisanal condition and packaging.</p>
    </section>

    <section className="mb-12">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-6">The Return Process</h2>
      <ol className="list-decimal pl-6 space-y-4">
        <li>Contact the Curator at curator@citropoth.com with your Order ID.</li>
        <li>We will provide a curated return label and instructions.</li>
        <li>Secure the piece in its original packaging.</li>
        <li>Once received and inspected, we will issue a full refund to your original payment method.</li>
      </ol>
    </section>

    <section className="mb-12">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-6">Sustainable Exchanges</h2>
      <p>If you prefer an exchange, we recommend returning the original item and initiating a new acquisition journey for the piece you truly desire.</p>
    </section>
    
    <div className="p-8 border-2 border-dashed border-stone-200 rounded-[2rem] text-center">
       <p className="text-stone-400 font-serif text-lg">Questions about a specific return?</p>
       <button className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#F5A18C] border-b-2 border-[#F5A18C] pb-1">Speak with the Curator</button>
    </div>
  </div>
);

const ContactCuratorView: React.FC = () => {
  const [sent, setSent] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) return (
    <div className="min-h-[60vh] flex items-center justify-center animate-in zoom-in-95 duration-500 px-4">
       <div className="text-center max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-stone-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
             <i className="fa-solid fa-feather-pointed text-3xl"></i>
          </div>
          <h2 className="text-3xl font-serif mb-4">Message Entrusted</h2>
          <p className="text-stone-500 leading-relaxed mb-8">Your inquiry has been placed on the Curator's desk. We read every word with care and will respond within two sunrises.</p>
          <button onClick={() => setSent(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5A18C] border-b-2 border-[#F5A18C] pb-1">Return to Desk</button>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5A18C] mb-4 block">Direct Dialogue</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-tight text-stone-900">The Curator's Desk</h1>
          <p className="text-stone-600 text-lg leading-relaxed mb-12">Seeking guidance on a specific piece, a private commission, or simply tracking your artisanal journey? Our curators are here to bridge the gap between you and the masters.</p>
          
          <div className="space-y-10">
             <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 flex-shrink-0">
                   <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Studio HQ</h4>
                   <p className="text-stone-800 font-medium">The Slow District, 42 Artisan Way<br />DH 1212, Bangladesh</p>
                </div>
             </div>
             <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 flex-shrink-0">
                   <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Electronic Mail</h4>
                   <p className="text-stone-800 font-medium">curator@citropoth.com</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-stone-100 relative overflow-hidden">
           <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Your Name</label>
                 <input required type="text" placeholder="As you wish to be addressed" className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#F5A18C] outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Email for Response</label>
                 <input required type="email" placeholder="artisan@collector.com" className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#F5A18C] outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Topic of Inquiry</label>
                 <select className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-[#F5A18C] outline-none cursor-pointer">
                    <option>Product Inquiries</option>
                    <option>Private Commissions</option>
                    <option>Shipping Wisdom</option>
                    <option>Artisan Partnership</option>
                    <option>General Gratitude</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Your Wisdom or Inquiry</label>
                 <textarea required rows={5} placeholder="Tell us your story..." className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#F5A18C] outline-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-stone-900 text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#F5A18C] transition-all shadow-xl">Transmit to Curator</button>
           </form>
        </div>
      </div>
    </div>
  );
};

const ProductDetailView: React.FC<{
  product?: Product;
  onAddToCart: (p: Product) => void;
  onAddReview: (r: Omit<Review, 'id' | 'date'>) => void;
}> = ({ product, onAddToCart, onAddReview }) => {
  const [aiStory, setAiStory] = useState<string>('');
  const [loadingStory, setLoadingStory] = useState(false);

  useEffect(() => {
    if (product) {
      setLoadingStory(true);
      generateProductStory(product.name).then(story => {
        setAiStory(story || '');
        setLoadingStory(false);
      });
    }
  }, [product]);

  if (!product) return <div className="py-20 text-center font-serif text-2xl">Product not found.</div>;

  return (
    <div className="animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-stone-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-[#F5A18C] font-black tracking-[0.4em] text-[10px] uppercase mb-4">{product.category}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight text-stone-900">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-10">
              <span className="text-3xl font-light text-stone-900">${product.price.toFixed(2)}</span>
              <div className="h-6 w-px bg-stone-200"></div>
              <div className="flex text-amber-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-stone-200'}`}></i>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-4">The Artisan's Intent</h3>
              <p className="text-stone-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* AI Generated Story */}
            <div className="mb-12 p-8 bg-stone-50 rounded-3xl border border-stone-100 italic">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#F5A18C] mb-3">Studio Reflection</h4>
              {loadingStory ? (
                <div className="h-4 bg-stone-200 rounded animate-pulse w-3/4"></div>
              ) : (
                <p className="text-stone-700 font-serif text-lg leading-relaxed">"{aiStory}"</p>
              )}
            </div>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-stone-900 text-white py-5 text-xs font-black uppercase tracking-[0.3em] rounded-xl hover:bg-stone-800 transition-all shadow-xl transform active:scale-[0.98] mb-8"
            >
              ACQUIRE THIS PIECE
            </button>

            <div className="flex items-center gap-8 py-6 border-t border-stone-100">
               <div className="flex items-center gap-2">
                 <i className="fa-solid fa-earth-americas text-stone-400"></i>
                 <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Ethical Sourcing</span>
               </div>
               <div className="flex items-center gap-2">
                 <i className="fa-solid fa-hand-sparkles text-stone-400"></i>
                 <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Masterwork</span>
               </div>
            </div>
          </div>
        </div>

        <ReviewSection reviews={product.reviews} onAddReview={onAddReview} />
      </div>
    </div>
  );
};

const BlogView: React.FC<{ blogs: BlogPost[], onSelectBlog: (id: string) => void }> = ({ blogs, onSelectBlog }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-in fade-in duration-500">
    <div className="text-center max-w-2xl mx-auto mb-20">
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5A18C] mb-4 block">The Journal</span>
      <h2 className="text-4xl md:text-5xl font-serif mb-6 italic">Stories of Craft & Soul</h2>
      <p className="text-stone-500 text-lg">Go behind the studio doors to explore the philosophy of slow living and the hands that create beauty.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {blogs.map(blog => (
        <article key={blog.id} className="group cursor-pointer" onClick={() => onSelectBlog(blog.id)}>
          <div className="aspect-[16/10] overflow-hidden rounded-3xl mb-6 shadow-lg bg-stone-100">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#F5A18C] mb-2 block">{blog.category}</span>
          <h3 className="text-2xl font-serif mb-4 group-hover:text-stone-600 transition-colors">{blog.title}</h3>
          <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2">{blog.excerpt}</p>
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
             <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">{blog.date}</span>
             <span className="text-[9px] font-black uppercase tracking-widest text-stone-900 group-hover:translate-x-1 transition-transform">Read Story <i className="fa-solid fa-arrow-right-long ml-1"></i></span>
          </div>
        </article>
      ))}
    </div>
  </div>
);

const BlogPostView: React.FC<{ blog?: BlogPost, onSetPage: (p: Page) => void }> = ({ blog, onSetPage }) => {
  if (!blog) return <div className="py-20 text-center font-serif text-2xl">Journal entry not found.</div>;

  return (
    <div className="animate-in fade-in duration-700">
      <div className="h-[60vh] relative overflow-hidden bg-stone-900">
         <img src={blog.image} alt={blog.title} className="w-full h-full object-cover opacity-60" />
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl px-4 text-center">
              <span className="text-[#F5A18C] font-black tracking-[0.5em] text-xs uppercase mb-6 block">{blog.category}</span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-8">{blog.title}</h1>
              <div className="flex items-center justify-center gap-6 text-white/80 text-[10px] font-black uppercase tracking-widest">
                <span>By {blog.author}</span>
                <span className="h-4 w-px bg-white/20"></span>
                <span>{blog.date}</span>
              </div>
            </div>
         </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="prose prose-stone prose-lg max-w-none mb-16">
          <p className="text-2xl font-serif italic text-stone-600 mb-10 leading-relaxed border-l-4 border-[#F5A18C] pl-8">{blog.excerpt}</p>
          <div className="text-stone-700 leading-loose space-y-8">
            {blog.content.split('\n').map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </div>

        <div className="py-12 border-y border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-8">
           <ShareButtons title={blog.title} url={window.location.href} />
           <button 
             onClick={() => onSetPage(Page.Blog)}
             className="text-[10px] font-black uppercase tracking-widest text-stone-900 border border-stone-900 px-6 py-3 rounded-xl hover:bg-stone-900 hover:text-white transition-all"
           >
             Back to Journal
           </button>
        </div>
      </div>
    </div>
  );
};

const CartView: React.FC<{
  cart: CartItem[];
  onSetPage: (p: Page) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  total: number;
}> = ({ cart, onSetPage, onUpdateQty, onRemove, total }) => (
  <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
    <h2 className="text-4xl font-serif mb-12">Your Studio Bag</h2>

    {cart.length === 0 ? (
      <div className="text-center py-20 bg-stone-50 rounded-[3rem] border border-stone-100">
         <p className="text-stone-400 font-serif text-2xl mb-8">Your bag is currently light.</p>
         <button 
           onClick={() => onSetPage(Page.Shop)}
           className="bg-stone-900 text-white px-10 py-4 text-xs font-black uppercase tracking-[0.3em] rounded-xl hover:bg-[#F5A18C] transition-all"
         >
           Explore Collection
         </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="flex gap-6 pb-8 border-b border-stone-100 group">
              <div className="w-24 h-32 flex-shrink-0 bg-stone-100 rounded-2xl overflow-hidden shadow-sm">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col justify-between py-1">
                 <div>
                   <h3 className="font-serif text-xl mb-1 group-hover:text-stone-600 transition-colors">{item.name}</h3>
                   <p className="text-[10px] font-black text-[#F5A18C] uppercase tracking-widest">{item.category}</p>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                       <button onClick={() => onUpdateQty(item.id, -1)} className="px-3 py-1 hover:bg-stone-100"><i className="fa-solid fa-minus text-[10px]"></i></button>
                       <span className="px-4 text-xs font-bold text-stone-700">{item.quantity}</span>
                       <button onClick={() => onUpdateQty(item.id, 1)} className="px-3 py-1 hover:bg-stone-100"><i className="fa-solid fa-plus text-[10px]"></i></button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors">Remove</button>
                 </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-light text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-[10px] text-stone-400">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-stone-50 p-8 rounded-[2.5rem] h-fit sticky top-32 border border-stone-100 shadow-sm">
           <h3 className="text-xl font-serif mb-8">Acquisition Summary</h3>
           <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                 <span className="text-stone-500 uppercase tracking-widest font-bold text-[10px]">Subtotal</span>
                 <span className="text-stone-900 font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-stone-500 uppercase tracking-widest font-bold text-[10px]">Logistics</span>
                 <span className="text-stone-900 font-bold">{total > 150 ? 'Complimentary' : '$15.00'}</span>
              </div>
           </div>
           <div className="pt-6 border-t border-stone-200 flex justify-between items-end mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">Total</span>
              <span className="text-2xl font-serif text-stone-900">${(total > 150 ? total : total + 15).toFixed(2)}</span>
           </div>
           <button 
             onClick={() => onSetPage(Page.Checkout)}
             className="w-full bg-stone-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-stone-800 transition-all shadow-xl"
           >
             Proceed to Checkout
           </button>
        </div>
      </div>
    )}
  </div>
);

const CheckoutView: React.FC<{ cart: CartItem[], total: number, onComplete: () => void }> = ({ cart, total, onComplete }) => (
  <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
    <h2 className="text-4xl font-serif mb-12">Finalize the Journey</h2>
    <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); onComplete(); }}>
      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5A18C] mb-6">Delivery Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input required type="text" placeholder="First Name" className="col-span-1 bg-white border border-stone-200 p-4 rounded-xl text-sm focus:ring-1 focus:ring-[#F5A18C] outline-none" />
          <input required type="text" placeholder="Last Name" className="col-span-1 bg-white border border-stone-200 p-4 rounded-xl text-sm focus:ring-1 focus:ring-[#F5A18C] outline-none" />
          <input required type="email" placeholder="Email Address" className="col-span-2 bg-white border border-stone-200 p-4 rounded-xl text-sm focus:ring-1 focus:ring-[#F5A18C] outline-none" />
          <input required type="text" placeholder="Shipping Address" className="col-span-2 bg-white border border-stone-200 p-4 rounded-xl text-sm focus:ring-1 focus:ring-[#F5A18C] outline-none" />
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5A18C] mb-6">Logistics Choice</h3>
        <div className="space-y-3">
           <label className="flex items-center gap-4 p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
              <input type="radio" name="logistics" defaultChecked className="text-[#F5A18C] focus:ring-[#F5A18C]" />
              <div className="flex-grow">
                 <p className="text-xs font-black uppercase tracking-widest text-stone-900">Standard Craft Journey</p>
                 <p className="text-[10px] text-stone-500 italic">5-7 business days — Respecting the pace of craft.</p>
              </div>
           </label>
        </div>
      </section>

      <div className="pt-10 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-6">
         <div className="text-center sm:text-left">
           <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Total Acquisition Cost</p>
           <p className="text-3xl font-serif text-stone-900">${(total > 150 ? total : total + 15).toFixed(2)}</p>
         </div>
         <button 
           type="submit"
           className="w-full sm:w-auto bg-stone-900 text-white px-12 py-5 text-xs font-black uppercase tracking-[0.3em] rounded-xl hover:bg-[#F5A18C] transition-all shadow-2xl"
         >
           Complete Purchase
         </button>
      </div>
    </form>
  </div>
);

const AuthView: React.FC<{
  onAuthComplete: (u: User) => void;
  onRegister: (data: any) => boolean;
  onLogin: (email: string, pass: string) => User | null;
}> = ({ onAuthComplete, onRegister, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = onLogin(email, password);
      if (user) onAuthComplete(user);
      else setError('Invalid credentials. Please try again or join our studio.');
    } else {
      const success = onRegister({ name, email, password });
      if (success) {
        onAuthComplete({ name, email, isLoggedIn: true, isAdmin: false });
      } else {
        setError('This artisan email is already registered.');
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif mb-4">{isLogin ? 'Welcome Back' : 'Join the Studio'}</h2>
          <p className="text-stone-500 text-xs tracking-widest uppercase">Member of the Citropoth Community</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <input 
              required type="text" placeholder="FULL NAME" 
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 p-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-[#F5A18C] outline-none" 
            />
          )}
          <input 
            required type="email" placeholder="EMAIL ADDRESS" 
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 p-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-[#F5A18C] outline-none" 
          />
          <input 
            required type="password" placeholder="PASSWORD" 
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 p-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-[#F5A18C] outline-none" 
          />
          <button 
            type="submit"
            className="w-full bg-stone-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#F5A18C] transition-all shadow-xl"
          >
            {isLogin ? 'Sign In' : 'Become a Member'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
          >
            {isLogin ? "Don't have an account? Join us" : "Already a member? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminView: React.FC<{
  products: Product[];
  blogs: BlogPost[];
  user: User;
  registeredUsers: any[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddBlog: (b: BlogPost) => void;
  onUpdateBlog: (b: BlogPost) => void;
  onDeleteBlog: (id: string) => void;
}> = ({ products, blogs, user, registeredUsers, onAddProduct, onUpdateProduct, onDeleteProduct, onAddBlog, onUpdateBlog, onDeleteBlog }) => {
  const [tab, setTab] = useState<'products' | 'blogs' | 'users'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);

  // Form states for Product
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pCategory, setPCategory] = useState<Product['category']>('Ceramics');
  const [pImage, setPImage] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pIsLimited, setPIsLimited] = useState(false);

  // Form states for Blog
  const [bTitle, setBTitle] = useState('');
  const [bExcerpt, setBExcerpt] = useState('');
  const [bContent, setBContent] = useState('');
  const [bCategory, setBCategory] = useState('');
  const [bImage, setBImage] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Product = {
      id: Date.now().toString(),
      name: pName,
      price: parseFloat(pPrice),
      category: pCategory,
      image: pImage || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
      description: pDesc,
      rating: 5,
      reviews: [],
      isLimited: pIsLimited
    };
    onAddProduct(newP);
    setShowProductForm(false);
    // Reset form
    setPName(''); setPPrice(''); setPDesc(''); setPImage(''); setPIsLimited(false);
  };

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const newB: BlogPost = {
      id: 'b' + Date.now().toString(),
      title: bTitle,
      excerpt: bExcerpt,
      content: bContent,
      category: bCategory,
      author: user.name || 'Chief Artisan',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      image: bImage || 'https://images.unsplash.com/photo-1459749411177-0421800673e6?auto=format&fit=crop&q=80&w=800'
    };
    onAddBlog(newB);
    setShowBlogForm(false);
    // Reset form
    setBTitle(''); setBExcerpt(''); setBContent(''); setBCategory(''); setBImage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-serif mb-2">Curator's Dashboard</h2>
          <p className="text-stone-500 text-sm uppercase tracking-widest font-black">Managing the Citropoth Archive</p>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-xl">
          {(['products', 'blogs', 'users'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${tab === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-[2.5rem] shadow-sm overflow-hidden p-8">
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-serif">Product Inventory</h3>
               <button 
                 onClick={() => setShowProductForm(!showProductForm)}
                 className="bg-stone-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#F5A18C] transition-all"
               >
                 {showProductForm ? 'Close Form' : 'Catalog New Item'}
               </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleAddProduct} className="mb-12 bg-stone-50 p-8 rounded-[2rem] border border-stone-100 animate-in slide-in-from-top-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required type="text" placeholder="PRODUCT NAME" value={pName} onChange={e => setPName(e.target.value)} className="bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none" />
                <input required type="number" step="0.01" placeholder="PRICE ($)" value={pPrice} onChange={e => setPPrice(e.target.value)} className="bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none" />
                <select value={pCategory} onChange={e => setPCategory(e.target.value as any)} className="bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none cursor-pointer">
                   <option>Ceramics</option>
                   <option>Textiles</option>
                   <option>Paintings</option>
                   <option>DIY Kits</option>
                   <option>Jewelry</option>
                </select>
                <input type="url" placeholder="IMAGE URL (leave blank for placeholder)" value={pImage} onChange={e => setPImage(e.target.value)} className="bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none" />
                <textarea required placeholder="DESCRIPTION" value={pDesc} onChange={e => setPDesc(e.target.value)} className="md:col-span-2 bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none h-32" />
                <label className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" checked={pIsLimited} onChange={e => setPIsLimited(e.target.checked)} className="rounded text-[#F5A18C] focus:ring-[#F5A18C]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Mark as Limited Release</span>
                </label>
                <button type="submit" className="md:col-span-2 bg-[#F5A18C] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#e08b76] transition-all shadow-lg">Submit to Catalog</button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                    <th className="px-6 py-4">Piece</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Limited</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100">
                             <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-serif text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-stone-600 uppercase tracking-widest">{p.category}</td>
                      <td className="px-6 py-4 font-light text-sm">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                         {p.isLimited ? <span className="text-[8px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Yes</span> : <span className="text-[8px] font-black uppercase tracking-widest bg-stone-100 text-stone-400 px-2 py-0.5 rounded">No</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => onDeleteProduct(p.id)} className="text-stone-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest">Archive</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'blogs' && (
          <div>
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-serif">Journal Archives</h3>
               <button 
                 onClick={() => setShowBlogForm(!showBlogForm)}
                 className="bg-stone-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#F5A18C] transition-all"
               >
                 {showBlogForm ? 'Close Editor' : 'Compose New Story'}
               </button>
            </div>

            {showBlogForm && (
              <form onSubmit={handleAddBlog} className="mb-12 bg-stone-50 p-8 rounded-[2rem] border border-stone-100 animate-in slide-in-from-top-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required type="text" placeholder="STORY TITLE" value={bTitle} onChange={e => setBTitle(e.target.value)} className="bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none" />
                <input required type="text" placeholder="CATEGORY (e.g. Philosophy, Tutorial)" value={bCategory} onChange={e => setBCategory(e.target.value)} className="bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none" />
                <input type="url" placeholder="FEATURED IMAGE URL" value={bImage} onChange={e => setBImage(e.target.value)} className="bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none" />
                <input required type="text" placeholder="EXCERPT (SHORT SUMMARY)" value={bExcerpt} onChange={e => setBExcerpt(e.target.value)} className="bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none" />
                <textarea required placeholder="STORY CONTENT" value={bContent} onChange={e => setBContent(e.target.value)} className="md:col-span-2 bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold tracking-widest uppercase outline-none h-48" />
                <button type="submit" className="md:col-span-2 bg-[#F5A18C] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#e08b76] transition-all shadow-lg">Publish to Journal</button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {blogs.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4 font-serif text-sm">{b.title}</td>
                      <td className="px-6 py-4 text-[10px] font-bold text-stone-600 uppercase tracking-widest">{b.author}</td>
                      <td className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-stone-400">{b.date}</td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => onDeleteBlog(b.id)} className="text-stone-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="overflow-x-auto">
            <h3 className="text-xl font-serif mb-8">Registered Artisans & Collectors</h3>
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                <tr className="bg-amber-50/30">
                  <td className="px-6 py-4 font-bold text-sm">Ukay Mong Utsho (Chief Artisan)</td>
                  <td className="px-6 py-4 text-stone-600 text-xs">ukaymongutsho@gmail.com</td>
                  <td className="px-6 py-4"><span className="text-[8px] font-black uppercase tracking-widest bg-stone-900 text-white px-2 py-0.5 rounded">Administrator</span></td>
                </tr>
                {registeredUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-sm">{u.name}</td>
                    <td className="px-6 py-4 text-stone-600 text-xs">{u.email}</td>
                    <td className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-stone-400">Collector</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileView: React.FC<{ user: User, orders: Order[], onUpdateUser: (u: User) => void }> = ({ user, orders, onUpdateUser }) => (
  <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white border border-stone-100 rounded-[2rem] p-8 text-center shadow-sm">
           <div className="w-24 h-24 bg-stone-100 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-serif text-stone-400 uppercase">
             {user.name.charAt(0)}
           </div>
           <h3 className="text-xl font-serif mb-1">{user.name}</h3>
           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">{user.email}</p>
           <button className="w-full border border-stone-200 text-stone-600 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-all">Edit Account</button>
        </div>
      </div>

      <div className="lg:col-span-3">
        <h2 className="text-3xl font-serif mb-8">Artisan Journeys (Your Orders)</h2>
        {orders.length === 0 ? (
          <div className="p-16 bg-stone-50 rounded-[3rem] border border-stone-100 text-center">
            <p className="text-stone-400 italic mb-6">You haven't initiated any journeys yet.</p>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#F5A18C] border-b-2 border-[#F5A18C] pb-1">Start Exploring</button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-stone-100 rounded-[2rem] overflow-hidden shadow-sm group">
                <div className="bg-stone-50 px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-stone-100">
                   <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-stone-500">
                      <div><span className="text-stone-300 mr-2">Order</span> {order.id}</div>
                      <div><span className="text-stone-300 mr-2">Initiated</span> {order.date}</div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">{order.status}</span>
                      <span className="font-serif text-lg text-stone-900">${order.total.toFixed(2)}</span>
                   </div>
                </div>
                <div className="p-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                   {order.items.map(item => (
                     <div key={item.id} className="space-y-2">
                       <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 shadow-sm">
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <p className="text-[9px] font-bold text-stone-900 uppercase truncate">{item.name}</p>
                       <p className="text-[8px] text-stone-400 uppercase tracking-widest font-black">Qty: {item.quantity}</p>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const PrivacyView: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-in fade-in duration-500 prose prose-stone">
    <h1 className="font-serif text-4xl mb-8">Privacy Vision</h1>
    <p className="text-lg text-stone-600 mb-8 italic">Your journey through Citropoth is intimate, and we honor the sanctuary of your personal data with the same reverence we give to our crafts.</p>
    
    <section className="mb-10">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-4">1. Information Gathered</h2>
      <p>We collect only what is necessary to bridge the gap between artisan and collector: your name for the legacy, your email for updates, and your address for the journey of the physical piece. We do not engage in digital harvesting.</p>
    </section>

    <section className="mb-10">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-4">2. The Sanctity of Data</h2>
      <p>Your details are stored in encrypted environments. We never sell your story to third parties. Data is shared only with our logistics partners to ensure your chosen masterpieces arrive safely at your door.</p>
    </section>

    <section className="mb-10">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-4">3. Artisanal Cookies</h2>
      <p>We use essential cookies to remember your Studio Bag and authentication state. These small threads of data ensure a seamless experience as you explore our collection.</p>
    </section>
    
    <div className="p-8 bg-stone-100 rounded-2xl italic text-stone-500 text-sm">
      "In a digital world, privacy is the ultimate luxury. We treat your data as a sacred trust."
    </div>
  </div>
);

const TermsView: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-in fade-in duration-500 prose prose-stone">
    <h1 className="font-serif text-4xl mb-8">Terms of Craft</h1>
    <p className="text-lg text-stone-600 mb-8 italic">Welcome to Citropoth. By entering our studio, you agree to respect the pace of craft and the philosophy of our community.</p>

    <section className="mb-10">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-4">1. Artisanal Variations</h2>
      <p>Every piece in Citropoth is handcrafted. As such, no two objects are identical. Slight variations in color, texture, and form are not flaws, but the fingerprints of the artisan. By purchasing, you embrace this inherent uniqueness.</p>
    </section>

    <section className="mb-10">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-4">2. Intellectual Soul</h2>
      <p>The stories, images, and designs featured on Citropoth are the intellectual property of our artisans and studio curators. We invite you to share them with credit, but commercial reproduction without written wisdom is forbidden.</p>
    </section>

    <section className="mb-10">
      <h2 className="text-xl font-bold uppercase tracking-widest text-stone-800 mb-4">3. The Return Journey</h2>
      <p>If a piece does not resonate with your space, you may initiate a return within 14 days of arrival. Masterpieces must be in their original state of grace. Returns are processed with a focus on sustainability.</p>
    </section>

    <div className="p-8 bg-[#F5A18C]/10 border-l-4 border-[#F5A18C] rounded-r-2xl text-stone-700 text-sm">
      <strong>Note:</strong> Citropoth serves as a gallery and bridge between master artisans and collectors. We curate with intention and ship with soul.
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  // Data State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(MOCK_BLOGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User>({ name: '', email: '', isLoggedIn: false });
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [aiTip, setAiTip] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    const savedBlogs = localStorage.getItem('blogs');
    if (savedBlogs) setBlogs(JSON.parse(savedBlogs));
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentPage === Page.Home && !aiTip) {
      handleGetAiTip("creativity in small spaces");
    }
  }, [currentPage, aiTip]);

  const handleGetAiTip = async (query: string) => {
    setIsAiLoading(true);
    const tip = await getCraftRecommendation(query);
    setAiTip(tip || '');
    setIsAiLoading(false);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleLogout = () => {
    const newUser = { name: '', email: '', isLoggedIn: false, isAdmin: false };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setCurrentPage(Page.Home);
  };

  const handleRegister = (data: any) => {
    const exists = registeredUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return false;
    setRegisteredUsers([...registeredUsers, { ...data }]);
    return true;
  };

  const handleLogin = (email: string, pass: string): User | null => {
    if (email.toLowerCase() === 'ukaymongutsho@gmail.com' && pass === 'Ukay@2345#') {
      return { name: 'Chief Artisan (Admin)', email, isLoggedIn: true, isAdmin: true };
    }
    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (found) {
      return { name: found.name, email: found.email, isLoggedIn: true, isAdmin: false };
    }
    return null;
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const renderContent = () => {
    switch(currentPage) {
      case Page.Home: 
        return <HomeView 
          onSetPage={setCurrentPage} 
          products={products} 
          onAddToCart={addToCart} 
          onSelectProduct={(id) => { setSelectedProductId(id); setCurrentPage(Page.ProductDetail); }}
          aiTip={aiTip}
          isAiLoading={isAiLoading}
          onRefreshTip={() => handleGetAiTip("something tactile and modern")}
        />;
      case Page.Shop: 
        return (
          <ShopView 
            products={products} 
            onSelectProduct={(id) => { setSelectedProductId(id); setCurrentPage(Page.ProductDetail); }}
            onQuickView={(id) => setQuickViewProductId(id)}
          />
        );
      case Page.LimitedReleases:
        return (
          <LimitedReleasesView 
            products={products} 
            onSelectProduct={(id) => { setSelectedProductId(id); setCurrentPage(Page.ProductDetail); }}
            onQuickView={(id) => setQuickViewProductId(id)}
          />
        );
      case Page.Masters:
        return <MastersView />;
      case Page.EthicalSourcing:
        return <EthicalSourcingView />;
      case Page.ContactCurator:
        return <ContactCuratorView />;
      case Page.JourneyLogistics:
        return <JourneyLogisticsView />;
      case Page.StudioReturns:
        return <StudioReturnsView />;
      case Page.ProductDetail: 
        return <ProductDetailView 
          product={products.find(p => p.id === selectedProductId)}
          onAddToCart={addToCart}
          onAddReview={(newRev) => {
            const updatedProducts = products.map(p => {
              if (p.id === selectedProductId) {
                const updatedRev: Review = {
                  ...newRev,
                  id: Date.now().toString(),
                  date: new Date().toISOString().split('T')[0]
                };
                return { ...p, reviews: [updatedRev, ...p.reviews] };
              }
              return p;
            });
            setProducts(updatedProducts);
          }}
        />;
      case Page.Blog: 
        return <BlogView blogs={blogs} onSelectBlog={(id) => { setSelectedBlogId(id); setCurrentPage(Page.BlogPost); }} />;
      case Page.BlogPost: 
        return <BlogPostView blog={blogs.find(b => b.id === selectedBlogId)} onSetPage={setCurrentPage} />;
      case Page.Cart: 
        return <CartView 
          cart={cart} 
          onSetPage={setCurrentPage} 
          onUpdateQty={updateCartQuantity} 
          onRemove={removeFromCart} 
          total={cartTotal} 
        />;
      case Page.Checkout: 
        return <CheckoutView 
          cart={cart} 
          total={cartTotal} 
          onComplete={() => { 
            const newOrder: Order = {
              id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
              userEmail: user.email || 'guest@anonymous.com',
              items: [...cart],
              total: cartTotal > 150 ? cartTotal : cartTotal + 15,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              status: 'Initiated'
            };
            setOrders([newOrder, ...orders]);
            alert('Artisan Journey Initiated! Order Placed Successfully.'); 
            setCart([]); 
            setCurrentPage(Page.Profile); 
          }} 
        />;
      case Page.Auth: 
        return <AuthView 
          onAuthComplete={(u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); setCurrentPage(Page.Home); }} 
          onRegister={handleRegister}
          onLogin={handleLogin}
        />;
      case Page.Admin:
        if (!user.isAdmin) return <HomeView 
          onSetPage={setCurrentPage} 
          products={products} 
          onAddToCart={addToCart} 
          onSelectProduct={(id) => { setSelectedProductId(id); setCurrentPage(Page.ProductDetail); }}
          aiTip={aiTip}
          isAiLoading={isAiLoading}
          onRefreshTip={() => handleGetAiTip("something tactile and modern")}
        />;
        return <AdminView 
          products={products}
          blogs={blogs}
          user={user}
          registeredUsers={registeredUsers}
          onAddProduct={(p) => setProducts([p, ...products])}
          onUpdateProduct={(p) => setProducts(products.map(old => old.id === p.id ? p : old))}
          onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
          onAddBlog={(b) => setBlogs([b, ...blogs])}
          onUpdateBlog={(b) => setBlogs(blogs.map(old => old.id === b.id ? b : old))}
          onDeleteBlog={(id) => setBlogs(blogs.filter(b => b.id !== id))}
        />;
      case Page.Profile:
        return <ProfileView user={user} orders={orders} onUpdateUser={setUser} />;
      case Page.Privacy:
        return <PrivacyView />;
      case Page.Terms:
        return <TermsView />;
      default: return <HomeView 
          onSetPage={setCurrentPage} 
          products={products} 
          onAddToCart={addToCart} 
          onSelectProduct={(id) => { setSelectedProductId(id); setCurrentPage(Page.ProductDetail); }}
          aiTip={aiTip}
          isAiLoading={isAiLoading}
          onRefreshTip={() => handleGetAiTip("something tactile and modern")}
        />;
    }
  };

  return (
    <>
      <Layout 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        user={user} 
        cart={cart}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
      <QuickViewModal 
        product={products.find(p => p.id === quickViewProductId) || null}
        onClose={() => setQuickViewProductId(null)}
        onAddToCart={addToCart}
        onViewDetails={(id) => { setSelectedProductId(id); setCurrentPage(Page.ProductDetail); }}
      />
    </>
  );
};

export default App;
