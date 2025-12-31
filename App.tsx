import React, { useState, useEffect, useRef } from 'react';
import { Page, Product, BlogPost, CartItem, User, Review } from './types.ts';
import { MOCK_PRODUCTS, MOCK_BLOGS } from './constants.tsx';
import Layout from './components/Layout.tsx';
import ReviewSection from './components/ReviewSection.tsx';
import ShareButtons from './components/ShareButtons.tsx';
import { getCraftRecommendation } from './services/geminiService.ts';

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

    {/* Editor's Picks */}
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 text-center md:text-left gap-4">
          <div className="mb-2 md:mb-0">
            <h3 className="text-2xl sm:text-3xl font-serif mb-2">Editor's Picks</h3>
            <p className="text-stone-500 text-xs sm:text-sm">Most loved by our community this season.</p>
          </div>
          <button 
            onClick={() => onSetPage(Page.Shop)}
            className="text-stone-800 text-xs sm:text-sm font-bold border-b-2 border-[#F5A18C] pb-1 hover:text-[#F5A18C] transition-colors uppercase tracking-widest"
          >
            VIEW FULL CATALOG
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="group">
              <div 
                className="relative overflow-hidden aspect-square mb-4 md:mb-6 bg-stone-50 rounded-xl cursor-pointer shadow-sm"
                onClick={() => onSelectProduct(product.id)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                  className="absolute bottom-4 right-4 bg-white text-stone-900 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-lg opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 hover:bg-[#F5A18C] hover:text-white"
                  title="Add to cart"
                >
                  <i className="fa-solid fa-plus text-sm"></i>
                </button>
              </div>
              <div className="px-2">
                <h4 className="font-serif text-lg sm:text-xl mb-1 group-hover:text-[#F5A18C] transition-colors">{product.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">{product.category}</span>
                  <span className="font-semibold text-stone-900">${product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
        <select className="flex-grow md:flex-initial bg-white border border-stone-200 p-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-stone-400 outline-none cursor-pointer rounded">
          <option>Sort By: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating: High to Low</option>
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
          </div>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1 font-bold">{product.category}</p>
          <h4 className="font-serif text-base sm:text-lg mb-1 group-hover:text-[#F5A18C] transition-colors line-clamp-1">{product.name}</h4>
          <span className="font-medium text-stone-900 text-sm sm:text-base">${product.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  </div>
);

const ProductDetailView: React.FC<{ 
  product: Product | undefined, 
  onAddToCart: (p: Product) => void,
  onAddReview: (newRev: Omit<Review, 'id' | 'date'>) => void
}> = ({ product, onAddToCart, onAddReview }) => {
  const [quantity, setQuantity] = useState(1);
  if (!product) return <div className="p-20 text-center text-stone-500 font-serif text-xl">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Product Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-lg lg:sticky lg:top-32">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
        </div>

        {/* Product Content */}
        <div className="lg:py-4">
          <div className="mb-8">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#F5A18C] font-black mb-4">{product.category}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6 leading-tight">{product.name}</h2>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-stone-100">
              <span className="text-2xl md:text-3xl font-light text-stone-900">${product.price.toFixed(2)}</span>
              <div className="flex items-center text-amber-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-stone-200'}`}></i>
                ))}
                <span className="text-stone-400 ml-3 text-xs font-bold uppercase tracking-widest">({product.reviews.length} Reflections)</span>
              </div>
            </div>

            <p className="text-stone-600 leading-relaxed text-sm sm:text-base md:text-lg mb-10">
              {product.description}
            </p>
            
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex border border-stone-200 rounded-lg justify-between items-center bg-white overflow-hidden w-full sm:w-36">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="flex-1 px-4 py-4 hover:bg-stone-50 transition-colors text-stone-600 focus:outline-none"
                    aria-label="Decrease quantity"
                  >
                    <i className="fa-solid fa-minus text-xs"></i>
                  </button>
                  <span className="px-4 py-4 font-bold text-stone-900 border-x border-stone-100 w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="flex-1 px-4 py-4 hover:bg-stone-50 transition-colors text-stone-600 focus:outline-none"
                    aria-label="Increase quantity"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                  </button>
                </div>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="flex-grow bg-stone-900 text-white py-4 px-8 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl rounded-lg transform active:scale-[0.98]"
                >
                  ADD TO STUDIO BAG
                </button>
              </div>
              
              <div className="pt-8 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-xs text-stone-500 bg-stone-50 p-4 rounded-xl">
                  <i className="fa-solid fa-truck-fast mr-3 text-[#F5A18C] text-base"></i>
                  <span className="font-medium">Free sustainable shipping on orders over $150</span>
                </div>
                <div className="flex items-center text-xs text-stone-500 bg-stone-50 p-4 rounded-xl">
                  <i className="fa-solid fa-leaf mr-3 text-[#F5A18C] text-base"></i>
                  <span className="font-medium">Packaged with 100% recycled materials</span>
                </div>
              </div>

              <div className="pt-8 flex justify-center lg:justify-start">
                <ShareButtons title={product.name} url={window.location.href} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-24 py-10 md:py-16 px-6 md:px-12 bg-stone-100 rounded-2xl text-center italic text-stone-700 font-serif text-lg sm:text-xl md:text-2xl border-l-8 border-[#F5A18C] shadow-inner">
         "Crafted through quiet patience and ancient methods, this piece echoes the gentle hum of the artist's studio. It doesn't just fill a space; it anchors a memory."
      </div>

      <ReviewSection reviews={product.reviews} onAddReview={onAddReview} />
    </div>
  );
};

const BlogView: React.FC<{ blogs: BlogPost[], onSelectBlog: (id: string) => void }> = ({ blogs, onSelectBlog }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
    <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#F5A18C] mb-4 block">The Journal</span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">Stories from the Slow Studio</h2>
      <p className="text-stone-500 text-base md:text-lg lg:text-xl leading-relaxed">Insights from our shared creative journey, artisan deep-dives, and guides for the modern soul.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20">
      {blogs.map((blog) => (
        <div key={blog.id} className="group cursor-pointer" onClick={() => onSelectBlog(blog.id)}>
          <div className="relative overflow-hidden aspect-[16/9] mb-6 md:mb-8 rounded-2xl shadow-lg">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-stone-800">{blog.category}</div>
          </div>
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">{blog.date}</span>
            <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">{blog.author}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif mb-4 group-hover:text-[#F5A18C] transition-colors leading-tight">{blog.title}</h3>
          <p className="text-stone-600 text-sm sm:text-base mb-6 leading-relaxed line-clamp-3">{blog.excerpt}</p>
          <button className="text-[10px] font-bold border-b-2 border-stone-800 pb-1 uppercase tracking-widest hover:text-[#F5A18C] hover:border-[#F5A18C] transition-all">READ FULL STORY</button>
        </div>
      ))}
    </div>
  </div>
);

const BlogPostView: React.FC<{ blog: BlogPost | undefined, onSetPage: (p: Page) => void }> = ({ blog, onSetPage }) => {
  if (!blog) return null;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => onSetPage(Page.Blog)} className="mb-8 md:mb-12 text-[10px] font-bold tracking-widest text-stone-400 hover:text-stone-800 flex items-center transition-colors uppercase">
        <i className="fa-solid fa-arrow-left mr-3"></i> Back to Journal
      </button>
      <div className="mb-8 md:mb-16 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5A18C] mb-6">{blog.category}</p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-8 leading-tight">{blog.title}</h2>
        <div className="flex items-center justify-center space-x-6 text-stone-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          <span>{blog.author}</span>
          <div className="w-1.5 h-1.5 bg-[#F5A18C] rounded-full"></div>
          <span>{blog.date}</span>
        </div>
      </div>
      <div className="aspect-[16/9] mb-12 md:mb-20 rounded-2xl overflow-hidden shadow-2xl">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
      </div>
      <div className="prose prose-stone prose-base sm:prose-lg max-w-none">
        <p className="leading-relaxed text-stone-700 mb-8 text-lg sm:text-xl font-medium italic opacity-80">"{blog.excerpt}"</p>
        <p className="leading-relaxed text-stone-700 mb-8">{blog.content}</p>
        <div className="bg-stone-50 p-8 md:p-12 border-l-8 border-[#F5A18C] my-12 rounded-r-2xl shadow-inner">
          <p className="italic text-xl sm:text-2xl text-stone-800 font-serif leading-relaxed">"Creativity is not about finding something new, but about seeing the familiar with a fresh spirit of curiosity."</p>
        </div>
        <p className="leading-relaxed text-stone-700 mb-8">{blog.content}</p>
        <p className="leading-relaxed text-stone-700">{blog.content}</p>
      </div>
      <div className="mt-16 md:mt-24 pt-10 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-6">
         <ShareButtons title={blog.title} url={window.location.href} />
         <button 
           onClick={() => onSetPage(Page.Blog)}
           className="text-stone-400 hover:text-stone-800 text-[10px] font-bold uppercase tracking-widest transition-colors"
         >
           More Journal Entries
         </button>
      </div>
    </div>
  );
};

const CartView: React.FC<{ 
  cart: CartItem[], 
  onSetPage: (p: Page) => void,
  onUpdateQty: (id: string, d: number) => void,
  onRemove: (id: string) => void,
  total: number
}> = ({ cart, onSetPage, onUpdateQty, onRemove, total }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-serif mb-8 md:mb-12">Your Studio Bag</h2>
      {cart.length === 0 ? (
        <div className="text-center py-20 md:py-32 border-2 border-dashed border-stone-200 rounded-3xl bg-white/50 shadow-inner">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-bag-shopping text-4xl text-stone-200"></i>
          </div>
          <p className="text-stone-500 text-lg mb-8 font-serif">Your studio bag awaits its first artisanal piece.</p>
          <button 
            onClick={() => onSetPage(Page.Shop)}
            className="bg-stone-900 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all rounded-lg shadow-lg transform active:scale-95"
          >
            START CURATING
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 py-6 border-b border-stone-100 group">
                <div className="w-full sm:w-28 h-48 sm:h-36 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-[1.02]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif text-xl group-hover:text-[#F5A18C] transition-colors line-clamp-1 pr-4">{item.name}</h4>
                      <span className="font-bold text-stone-900 text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-4 font-bold">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-stone-200 rounded-lg text-xs font-bold bg-white overflow-hidden">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="px-4 py-2 hover:bg-stone-50 transition-colors text-stone-500 focus:outline-none">-</button>
                      <span className="px-5 py-2 border-x border-stone-100 w-12 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="px-4 py-2 hover:bg-stone-50 transition-colors text-stone-500 focus:outline-none">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-[10px] text-stone-400 hover:text-red-500 uppercase tracking-widest font-black transition-colors px-2 py-1">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-stone-100 lg:sticky lg:top-32">
            <h3 className="text-xl font-serif mb-8 pb-4 border-b border-stone-50">Curration Summary</h3>
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500 font-medium">Subtotal</span>
                <span className="font-bold text-stone-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500 font-medium">Sustainable Shipping</span>
                <span className={`font-bold ${total > 150 ? 'text-green-600' : 'text-stone-900'}`}>{total > 150 ? 'FREE' : '$15.00'}</span>
              </div>
              <div className="pt-5 border-t border-stone-100 flex justify-between font-serif text-2xl">
                <span>Total</span>
                <span className="text-stone-900">${(total > 150 ? total : total + 15).toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => onSetPage(Page.Checkout)}
              className="w-full bg-stone-900 text-white py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all shadow-lg rounded-xl transform active:scale-[0.98]"
            >
              PROCEED TO SECURE CHECKOUT
            </button>
            <div className="mt-8 flex items-center justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/BKash_Logo.svg" alt="bKash" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0a/Nagad_Logo.svg" alt="Nagad" className="h-4" />
            </div>
            <p className="mt-8 text-center text-[10px] text-stone-400 font-black uppercase tracking-widest">Secure SSL-Encrypted Checkout</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const CheckoutView: React.FC<{ cart: CartItem[], total: number, onComplete: () => void }> = ({ cart, total, onComplete }) => {
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onComplete();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Form Area */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-2xl sm:text-3xl font-serif mb-8 flex items-center">
              <span className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center mr-4">1</span>
              Studio Destination
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="w-full bg-white border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-500 outline-none rounded-xl" />
              <input type="text" placeholder="Last Name" className="w-full bg-white border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-500 outline-none rounded-xl" />
              <input type="email" placeholder="Email for Journey Updates" className="w-full sm:col-span-2 bg-white border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-500 outline-none rounded-xl" />
              <input type="text" placeholder="Full Address" className="w-full sm:col-span-2 bg-white border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-500 outline-none rounded-xl" />
              <input type="text" placeholder="City" className="w-full bg-white border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-500 outline-none rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="ZIP" className="w-full bg-white border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-500 outline-none rounded-xl" />
                <input type="text" placeholder="Country" value="Bangladesh" readOnly className="w-full bg-stone-50 border border-stone-100 p-4 text-sm text-stone-400 font-bold uppercase tracking-widest rounded-xl" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-serif mb-8 flex items-center">
              <span className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center mr-4">2</span>
              Payment Wisdom
            </h2>
            <div className="space-y-4">
              <button 
                onClick={() => setMethod('bkash')}
                className={`w-full flex items-center justify-between p-5 border rounded-2xl transition-all ${method === 'bkash' ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-100' : 'border-stone-100 hover:border-stone-300 bg-white'}`}
              >
                <div className="flex items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/BKash_Logo.svg" alt="bKash" className="h-6 md:h-8 mr-6" />
                  <div className="text-left">
                    <p className="font-bold text-stone-900 text-sm md:text-base uppercase tracking-widest">bKash Payout</p>
                    <p className="text-[10px] text-stone-500 font-medium">Safe & Instant Digital Wallet</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'bkash' ? 'bg-pink-500 border-pink-500' : 'border-stone-200'}`}>
                  {method === 'bkash' && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                </div>
              </button>
              
              <button 
                onClick={() => setMethod('nagad')}
                className={`w-full flex items-center justify-between p-5 border rounded-2xl transition-all ${method === 'nagad' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100' : 'border-stone-100 hover:border-stone-300 bg-white'}`}
              >
                <div className="flex items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/0a/Nagad_Logo.svg" alt="Nagad" className="h-6 md:h-8 mr-6" />
                  <div className="text-left">
                    <p className="font-bold text-stone-900 text-sm md:text-base uppercase tracking-widest">Nagad Payout</p>
                    <p className="text-[10px] text-stone-500 font-medium">Direct Mobile Financing</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'nagad' ? 'bg-orange-500 border-orange-500' : 'border-stone-200'}`}>
                  {method === 'nagad' && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                </div>
              </button>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 animate-in slide-in-from-top-2 duration-500">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">Verified {method.toUpperCase()} Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">+880</span>
                  <input 
                    type="tel" 
                    placeholder="1XXXXXXXXX" 
                    className="w-full bg-white border border-stone-200 py-4 pl-16 pr-4 text-lg font-mono tracking-widest focus:ring-1 focus:ring-stone-500 outline-none rounded-xl"
                  />
                </div>
                <p className="mt-4 text-[10px] text-stone-400 italic font-medium leading-relaxed">
                  Upon clicking 'Confirm Order', a secure push notification will appear on your device for PIN entry. No card details stored.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-5">
          <div className="bg-stone-900 text-white p-8 sm:p-10 rounded-3xl h-fit sticky top-32 shadow-2xl overflow-hidden">
            {/* Visual background element */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-stone-800 rounded-full -translate-y-20 translate-x-20 opacity-20 pointer-events-none"></div>
            
            <h3 className="text-xl font-serif mb-10 text-[#F7E479] flex justify-between items-center">
              <span>Final Preview</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{cart.length} Masterpieces</span>
            </h3>
            
            <div className="space-y-6 mb-12 max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 border border-stone-800 shadow-inner flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="max-w-[150px] sm:max-w-[200px]">
                      <p className="font-bold truncate text-sm">{item.name}</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-stone-300 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-5 mb-12">
              <div className="flex justify-between text-xs text-stone-400">
                <span className="font-medium uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-400">
                <span className="font-medium uppercase tracking-widest">Studioship</span>
                <span className="font-bold text-[#F7E479]">Complimentary</span>
              </div>
              <div className="border-t border-stone-800 pt-8 flex justify-between items-end">
                <div className="text-stone-300">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-1">Grand Total</p>
                  <p className="text-3xl font-serif text-[#F7E479]">${total.toFixed(2)}</p>
                </div>
                <div className="text-right text-[9px] text-stone-600 font-bold uppercase tracking-widest mb-1">
                  Inclusive of all VAT
                </div>
              </div>
            </div>

            <button 
              className={`w-full py-5 text-xs font-black uppercase tracking-[0.3em] rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center ${
                isProcessing ? 'bg-stone-700 cursor-wait' : 'bg-[#F5A18C] hover:bg-[#e08b76] text-white'
              }`}
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  CONNECTING STUDIO...
                </>
              ) : 'AUTHORIZE TRANSACTION'}
            </button>
            <p className="mt-8 text-center text-[10px] text-stone-600 font-bold uppercase tracking-widest">
              Secured by CITROPOTH Payments Interface
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthView: React.FC<{ 
  onAuthComplete: (u: User) => void, 
  onRegister: (u: any) => boolean,
  onLogin: (email: string, pass: string) => User | null
}> = ({ onAuthComplete, onRegister, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const authenticatedUser = onLogin(formData.email, formData.password);
      if (authenticatedUser) {
        onAuthComplete(authenticatedUser);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } else {
      const success = onRegister({ ...formData });
      if (success) {
        // Automatically switch to login or notify user
        setIsLogin(true);
        setError(null);
        setFormData({ ...formData, password: '' }); // Clear password for security
        alert("Studio account created! Please sign in with your credentials.");
      } else {
        setError("This email is already linked to an artisan legacy.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 md:py-32 animate-in fade-in duration-700">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-stone-100">
        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-center leading-tight">{isLogin ? 'Welcome Back' : 'Join Our Studio'}</h2>
        <p className="text-stone-400 text-xs sm:text-sm text-center mb-10 font-medium">{isLogin ? 'Enter your details to resume your journey.' : 'Create an account to begin your creative journey.'}</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-stone-50 border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-400 outline-none rounded-xl transition-all"
                placeholder="How shall we call you?"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-400 outline-none rounded-xl transition-all"
              placeholder="artisan@citropoth.com"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Secure Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 p-4 text-sm focus:ring-1 focus:ring-stone-400 outline-none rounded-xl transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-stone-900 text-white py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all rounded-xl shadow-lg mt-6 transform active:scale-[0.98]"
          >
            {isLogin ? 'SIGN IN' : 'CREATE STUDIO ACCOUNT'}
          </button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-stone-100 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-stone-500 text-xs font-bold uppercase tracking-widest hover:text-[#F5A18C] transition-colors"
          >
            {isLogin ? "No account? Start your legacy" : "Already an artisan? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ImagePicker: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">{label}</label>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="h-32 w-32 rounded-2xl bg-white border-2 border-dashed border-stone-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#F5A18C] transition-all group relative shadow-inner"
        >
          {value ? (
            <>
              <img src={value} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="fa-solid fa-camera text-white"></i>
              </div>
            </>
          ) : (
            <div className="text-center p-4">
              <i className="fa-solid fa-cloud-arrow-up text-stone-300 text-xl mb-1"></i>
              <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Select Image</p>
            </div>
          )}
        </div>
        <div className="flex-grow w-full">
          <input 
            type="text" 
            value={value.startsWith('data:') ? 'Image selected via upload' : value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-white border border-stone-200 p-4 text-sm rounded-xl outline-none focus:ring-1 focus:ring-[#F5A18C] mb-2" 
            placeholder="Or paste an image URL..."
          />
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900"
            >
              Upload local file
            </button>
            {value && (
              <button 
                type="button"
                onClick={clearImage}
                className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

const AdminView: React.FC<{
  products: Product[],
  onAddProduct: (p: Product) => void,
  onUpdateProduct: (p: Product) => void,
  onDeleteProduct: (id: string) => void,
  blogs: BlogPost[],
  onAddBlog: (b: BlogPost) => void,
  onUpdateBlog: (b: BlogPost) => void,
  onDeleteBlog: (id: string) => void,
  registeredUsers: any[],
  user: User
}> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, blogs, onAddBlog, onUpdateBlog, onDeleteBlog, registeredUsers, user }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'blogs' | 'users'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', price: 0, description: '', category: 'Ceramics', image: ''
  });
  const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({
    title: '', excerpt: '', content: '', author: user.name, category: 'Philosophy', image: ''
  });

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setNewProduct({ ...p });
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({ name: '', price: 0, description: '', category: 'Ceramics', image: '' });
    setShowProductForm(false);
  };

  const startEditBlog = (b: BlogPost) => {
    setEditingBlog(b);
    setNewBlog({ ...b });
    setShowBlogForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditBlog = () => {
    setEditingBlog(null);
    setNewBlog({ title: '', excerpt: '', content: '', author: user.name, category: 'Philosophy', image: '' });
    setShowBlogForm(false);
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      if (editingProduct) {
        onUpdateProduct({
          ...editingProduct,
          ...newProduct
        } as Product);
      } else {
        onAddProduct({
          ...newProduct as Product,
          id: Date.now().toString(),
          rating: 5,
          reviews: []
        });
      }
      cancelEdit();
    }
  };

  const submitBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlog.title && newBlog.content) {
      if (editingBlog) {
        onUpdateBlog({
          ...editingBlog,
          ...newBlog
        } as BlogPost);
      } else {
        onAddBlog({
          ...newBlog as BlogPost,
          id: 'b-' + Date.now(),
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        });
      }
      cancelEditBlog();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-10 md:gap-12">
        <aside className="w-full lg:w-64 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm lg:sticky lg:top-32">
            <h2 className="text-2xl font-serif mb-8 text-[#2D4A43]">Dashboard</h2>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 gap-3 scrollbar-hide">
              {(['products', 'blogs', 'users'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 lg:w-full text-center lg:text-left px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all transform active:scale-95 ${activeTab === tab ? 'bg-stone-900 text-white shadow-lg' : 'hover:bg-stone-50 text-stone-500 bg-white border border-stone-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex-grow bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-stone-100 min-h-[600px]">
          {activeTab === 'products' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-stone-100 gap-6">
                <div>
                  <h3 className="text-2xl font-serif mb-1">Studio Inventory</h3>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{products.length} Active Items</p>
                </div>
                <button 
                  onClick={() => {
                    if (showProductForm) cancelEdit();
                    else setShowProductForm(true);
                  }}
                  className="w-full sm:w-auto bg-[#F5A18C] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md hover:bg-[#e08b76] transition-all transform hover:scale-[1.02]"
                >
                  {showProductForm ? 'DISMISS FORM' : 'CATALOG NEW ITEM'}
                </button>
              </div>

              {showProductForm && (
                <form onSubmit={submitProduct} className="bg-stone-50 p-6 sm:p-10 rounded-2xl mb-12 space-y-8 border border-stone-100 animate-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Artisan Piece Name</label>
                      <input 
                        type="text" 
                        required
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full bg-white border border-stone-200 p-4 text-sm rounded-xl outline-none focus:ring-1 focus:ring-[#F5A18C]" 
                        placeholder="e.g. Handcrafted Indigo Bowl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Market Valuation ($)</label>
                      <input 
                        type="number" 
                        required
                        step="0.01"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        className="w-full bg-white border border-stone-200 p-4 text-sm rounded-xl outline-none focus:ring-1 focus:ring-[#F5A18C]" 
                      />
                    </div>
                  </div>
                  
                  <ImagePicker 
                    label="Artisan Piece Image"
                    value={newProduct.image || ''}
                    onChange={(val) => setNewProduct({...newProduct, image: val})}
                  />

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Story & Description</label>
                    <textarea 
                      required
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full bg-white border border-stone-200 p-4 text-sm rounded-xl outline-none focus:ring-1 focus:ring-[#F5A18C] h-32" 
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button type="submit" className="flex-grow bg-stone-900 text-white px-12 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-stone-800 shadow-lg">
                      {editingProduct ? 'Update Studio Catalog' : 'Commit to Studio Bag'}
                    </button>
                    {editingProduct && (
                      <button type="button" onClick={cancelEdit} className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                        Discard Edits
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-stone-100">
                      <th className="py-6 px-4 sm:px-0 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black">Craft Item</th>
                      <th className="py-6 px-4 sm:px-0 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black">Dept.</th>
                      <th className="py-6 px-4 sm:px-0 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black">Valuation</th>
                      <th className="py-6 px-4 sm:px-0 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black text-right">Curation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {products.map(p => (
                      <tr key={p.id} className="group hover:bg-stone-50 transition-colors">
                        <td className="py-6 px-4 sm:px-0">
                          <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 shadow-inner">
                               <img src={p.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="font-bold text-stone-800 line-clamp-1">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-6 px-4 sm:px-0">
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-3 py-1 bg-white border border-stone-200 rounded-full">{p.category}</span>
                        </td>
                        <td className="py-6 px-4 sm:px-0 font-bold text-stone-900 text-lg">${p.price.toFixed(2)}</td>
                        <td className="py-6 px-4 sm:px-0 text-right">
                          <div className="flex justify-end gap-5">
                            <button onClick={() => startEditProduct(p)} className="text-stone-300 hover:text-stone-900 transition-colors">
                              <i className="fa-solid fa-pen-to-square text-lg"></i>
                            </button>
                            <button onClick={() => onDeleteProduct(p.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                              <i className="fa-solid fa-trash-can text-lg"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'blogs' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-stone-100 gap-6">
                <div>
                  <h3 className="text-2xl font-serif mb-1">Journal Archives</h3>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{blogs.length} Stories Published</p>
                </div>
                <button 
                  onClick={() => {
                    if (showBlogForm) cancelEditBlog();
                    else setShowBlogForm(true);
                  }}
                  className="w-full sm:w-auto bg-stone-900 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md hover:bg-stone-800 transition-all transform hover:scale-[1.02]"
                >
                  {showBlogForm ? 'DISMISS EDITOR' : 'COMPOSE NEW STORY'}
                </button>
              </div>

              {showBlogForm && (
                <form onSubmit={submitBlog} className="bg-stone-50 p-6 sm:p-10 rounded-2xl mb-12 space-y-8 border border-stone-100 animate-in zoom-in-95 duration-300">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Story Title</label>
                    <input 
                      type="text" 
                      required
                      value={newBlog.title}
                      onChange={e => setNewBlog({...newBlog, title: e.target.value})}
                      className="w-full bg-white border border-stone-200 p-4 text-sm rounded-xl outline-none focus:ring-1 focus:ring-stone-400" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <ImagePicker 
                        label="Featured Image"
                        value={newBlog.image || ''}
                        onChange={(val) => setNewBlog({...newBlog, image: val})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Department/Category</label>
                      <input 
                        type="text" 
                        required
                        value={newBlog.category}
                        onChange={e => setNewBlog({...newBlog, category: e.target.value})}
                        className="w-full bg-white border border-stone-200 p-4 text-sm rounded-xl outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Summary (Excerpt)</label>
                    <textarea 
                      required
                      value={newBlog.excerpt}
                      onChange={e => setNewBlog({...newBlog, excerpt: e.target.value})}
                      className="w-full bg-white border border-stone-200 p-4 text-sm rounded-xl outline-none h-20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Full Story Content</label>
                    <textarea 
                      required
                      value={newBlog.content}
                      onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                      className="w-full bg-white border border-stone-200 p-4 text-sm rounded-xl outline-none h-60" 
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button type="submit" className="flex-grow bg-stone-900 text-white px-12 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-stone-800 shadow-lg">
                      {editingBlog ? 'Update Journal Entry' : 'Publish Story'}
                    </button>
                    {editingBlog && (
                      <button type="button" onClick={cancelEditBlog} className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                        Discard Draft
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 gap-6">
                {blogs.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-6 bg-stone-50 rounded-2xl border border-stone-100 group">
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 rounded-xl overflow-hidden shadow-inner">
                         <img src={b.image} className="h-full w-full object-cover" />
                       </div>
                       <div>
                         <h4 className="font-bold text-stone-800 mb-1">{b.title}</h4>
                         <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{b.date} — {b.category}</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => startEditBlog(b)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all border border-stone-100">
                          <i className="fa-solid fa-pen text-sm"></i>
                        </button>
                        <button onClick={() => onDeleteBlog(b.id)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400 hover:text-red-500 transition-all border border-stone-100">
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-serif mb-10 pb-6 border-b border-stone-100">Verified Artisans</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Always show the root admin first, then others from registeredUsers */}
                {[
                  { name: 'Chief Artisan (Admin)', role: 'Studio Curator', email: 'ukaymongutsho@gmail.com', join: 'Foundation', avatar: 'CA' },
                  ...registeredUsers.map(ru => ({
                    name: ru.name,
                    role: 'Independent Artisan',
                    email: ru.email,
                    join: 'Recently Joined',
                    avatar: ru.name.charAt(0).toUpperCase()
                  }))
                ].map((u, i) => (
                  <div key={i} className="flex items-center p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-black mr-4 shadow-md">
                      {u.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{u.name}</h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{u.role}</p>
                      <p className="text-[9px] text-stone-300 font-medium italic mt-1">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const ProfileView: React.FC<{ user: User, onUpdateUser: (u: User) => void }> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        <aside className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center lg:text-left">
            <div className="w-24 h-24 rounded-full bg-[#F5A18C] text-white flex items-center justify-center text-3xl font-serif mx-auto lg:mx-0 mb-6 shadow-xl ring-8 ring-stone-50">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-serif mb-2">{user.name}</h2>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">{user.email}</p>
            
            <nav className="flex flex-row lg:flex-col justify-center gap-3 lg:space-y-3">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex-1 lg:w-full text-center lg:text-left px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-stone-900 text-white shadow-lg scale-[1.02]' : 'hover:bg-stone-50 text-stone-500 bg-white border border-stone-100'}`}
              >
                Journey History
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 lg:w-full text-center lg:text-left px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-stone-900 text-white shadow-lg scale-[1.02]' : 'hover:bg-stone-50 text-stone-500 bg-white border border-stone-100'}`}
              >
                Preferences
              </button>
            </nav>
          </div>
        </aside>

        <section className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-100 shadow-sm min-h-[500px]">
            {activeTab === 'orders' ? (
              <div>
                <h3 className="text-2xl font-serif mb-10 pb-6 border-b border-stone-50">Recent Journeys</h3>
                <div className="flex flex-col items-center justify-center py-20 text-stone-300">
                   <i className="fa-solid fa-map-location-dot text-6xl mb-6 opacity-20"></i>
                   <p className="font-serif text-xl italic">No completed journeys yet.</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Start your artisan collection to see history here.</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-serif mb-10 pb-6 border-b border-stone-50">Curator Preferences</h3>
                <div className="space-y-8 max-w-md">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">DisplayName</label>
                     <input type="text" value={user.name} readOnly className="w-full bg-stone-50 border-none p-4 rounded-xl text-stone-500 cursor-not-allowed" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Primary Contact</label>
                     <input type="email" value={user.email} readOnly className="w-full bg-stone-50 border-none p-4 rounded-xl text-stone-500 cursor-not-allowed" />
                   </div>
                   <button className="bg-stone-100 text-stone-400 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                     Updating Preferences Locked
                   </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

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
    if (currentPage === Page.Home && !aiTip) {
      handleGetAiTip("creativity in small spaces");
    }
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Check master admin
    if (email.toLowerCase() === 'ukaymongutsho@gmail.com' && pass === 'Ukay@2345#') {
      return { name: 'Chief Artisan (Admin)', email, isLoggedIn: true, isAdmin: true };
    }
    // Check registered users
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
          onComplete={() => { alert('Artisan Journey Initiated! Order Placed Successfully.'); setCart([]); setCurrentPage(Page.Home); }} 
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
        return <ProfileView user={user} onUpdateUser={setUser} />;
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