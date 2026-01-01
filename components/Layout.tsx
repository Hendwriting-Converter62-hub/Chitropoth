import React, { useState } from 'react';
import { Page, User, CartItem } from '../types.ts';
import Logo from './Logo.tsx';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setPage: (page: Page) => void;
  user: User;
  cart: CartItem[];
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setPage, user, cart, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navigate = (page: Page) => {
    setPage(page);
    setIsMenuOpen(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-[#F5A18C]/30 selection:text-stone-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24 lg:h-28">
            {/* Logo Branding */}
            <div className="flex-shrink-0">
              <Logo 
                className="h-10 sm:h-12 md:h-16 lg:h-20" 
                onClick={() => navigate(Page.Home)} 
              />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 lg:space-x-12 items-center">
              <button 
                onClick={() => navigate(Page.Shop)}
                className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] hover:text-[#F5A18C] transition-colors relative group ${currentPage === Page.Shop ? 'text-[#F5A18C]' : 'text-stone-600'}`}
              >
                Shop
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#F5A18C] transform origin-left transition-transform duration-300 ${currentPage === Page.Shop ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
              <button 
                onClick={() => navigate(Page.Blog)}
                className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] hover:text-[#F5A18C] transition-colors relative group ${currentPage === Page.Blog ? 'text-[#F5A18C]' : 'text-stone-600'}`}
              >
                Journal
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#F5A18C] transform origin-left transition-transform duration-300 ${currentPage === Page.Blog ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
              
              <div className="h-4 w-px bg-stone-200 mx-2"></div>

              {user.isLoggedIn ? (
                <div className="flex items-center space-x-6 lg:space-x-8">
                  {user.isAdmin && (
                    <button 
                      onClick={() => navigate(Page.Admin)}
                      className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 rounded-lg transition-all ${currentPage === Page.Admin ? 'bg-stone-900 text-white border-stone-900 shadow-lg' : 'text-stone-600 border-stone-100 hover:border-stone-900 hover:shadow-sm'}`}
                    >
                      Admin
                    </button>
                  )}
                  <div className="flex flex-col items-end">
                    <button 
                      onClick={() => navigate(Page.Profile)}
                      className={`text-[10px] lg:text-[11px] font-black uppercase tracking-widest transition-colors hover:text-[#F5A18C] ${currentPage === Page.Profile ? 'text-[#F5A18C]' : 'text-stone-900'}`}
                    >
                      {user.name}
                    </button>
                    <button onClick={onLogout} className="text-[9px] uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 font-black transition-colors">Logout</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => navigate(Page.Auth)}
                  className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </button>
              )}

              <button 
                onClick={() => navigate(Page.Cart)}
                className={`relative p-3 rounded-full transition-all duration-300 ${currentPage === Page.Cart ? 'bg-[#F5A18C] text-white' : 'text-stone-700 hover:bg-stone-50 hover:text-[#F5A18C]'}`}
              >
                <i className="fa-solid fa-bag-shopping text-xl"></i>
                {cartCount > 0 && (
                  <span className={`absolute top-0 right-0 text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md border-2 border-white ${currentPage === Page.Cart ? 'bg-stone-900 text-white' : 'bg-[#F5A18C] text-white'}`}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu controls */}
            <div className="md:hidden flex items-center space-x-2">
              <button 
                onClick={() => navigate(Page.Cart)} 
                className={`relative p-3 rounded-full ${currentPage === Page.Cart ? 'text-[#F5A18C]' : 'text-stone-700'}`}
              >
                <i className="fa-solid fa-bag-shopping text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#F5A18C] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-stone-600 p-3 h-10 w-10 flex items-center justify-center rounded-full active:bg-stone-50 transition-colors"
                aria-label="Toggle menu"
              >
                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar/Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-2xl transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-[80vh] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}`}>
          <div className="px-6 flex flex-col space-y-6">
            <button 
              onClick={() => navigate(Page.Shop)}
              className={`text-xs font-black uppercase tracking-[0.3em] text-left py-2 ${currentPage === Page.Shop ? 'text-[#F5A18C]' : 'text-stone-600'}`}
            >
              Shop Collection
            </button>
            <button 
              onClick={() => navigate(Page.Blog)}
              className={`text-xs font-black uppercase tracking-[0.3em] text-left py-2 ${currentPage === Page.Blog ? 'text-[#F5A18C]' : 'text-stone-600'}`}
            >
              The Journal
            </button>
            <div className="h-px bg-stone-100"></div>
            {user.isLoggedIn ? (
              <>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600 uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest">{user.name}</p>
                      <button onClick={onLogout} className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Sign Out</button>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(Page.Profile)}
                    className="text-[9px] font-black text-white bg-stone-900 px-4 py-2 rounded-lg uppercase tracking-widest"
                  >
                    Profile
                  </button>
                </div>
                {user.isAdmin && (
                  <button 
                    onClick={() => navigate(Page.Admin)}
                    className="text-[9px] font-black uppercase tracking-widest text-stone-500 border border-stone-200 px-4 py-2 rounded-lg text-center"
                  >
                    Admin Control
                  </button>
                )}
              </>
            ) : (
              <button 
                onClick={() => navigate(Page.Auth)}
                className="text-xs font-black uppercase tracking-[0.3em] bg-stone-900 text-white py-4 rounded-xl text-center shadow-lg"
              >
                Sign In / Join Studio
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#2D4A43] text-stone-300 pt-16 md:pt-24 pb-10 overflow-hidden relative">
        {/* Artistic background element */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-20">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <Logo 
                className="h-14 sm:h-16 mb-8" 
                light={true} 
                onClick={() => navigate(Page.Home)} 
              />
              <p className="text-sm leading-relaxed text-stone-400 mb-8 max-w-sm">
                Chitropoth curates the finest handcrafted pieces from master artisans globally. Every object we feature carries a unique soul and a storied past.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#F5A18C] hover:text-white transition-all transform hover:-translate-y-1"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#F5A18C] hover:text-white transition-all transform hover:-translate-y-1"><i className="fa-brands fa-pinterest-p"></i></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#F5A18C] hover:text-white transition-all transform hover:-translate-y-1"><i className="fa-brands fa-twitter"></i></a>
              </div>
            </div>

            <div className="sm:pl-8 lg:pl-0">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">The Studio</h3>
              <ul className="space-y-4 text-xs font-medium tracking-wider">
                <li><button onClick={() => navigate(Page.Shop)} className="hover:text-[#F7E479] transition-colors text-left">Our Full Collection</button></li>
                <li><button onClick={() => navigate(Page.Shop)} className="hover:text-[#F7E479] transition-colors text-left">Limited Releases</button></li>
                <li><button onClick={() => navigate(Page.Blog)} className="hover:text-[#F7E479] transition-colors text-left">Artisan Journal</button></li>
                <li><a href="#" className="hover:text-[#F7E479] transition-colors">Meet the Masters</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">Curator Service</h3>
              <ul className="space-y-4 text-xs font-medium tracking-wider">
                <li><a href="#" className="hover:text-[#F7E479] transition-colors">Journey Logistics</a></li>
                <li><a href="#" className="hover:text-[#F7E479] transition-colors">Studio Returns</a></li>
                <li><a href="#" className="hover:text-[#F7E479] transition-colors">Ethical Sourcing</a></li>
                <li><a href="#" className="hover:text-[#F7E479] transition-colors">Contact Curator</a></li>
              </ul>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">Join the Slow Movement</h3>
              {subscribed ? (
                <div className="bg-[#F5A18C]/20 p-4 rounded-xl border border-[#F5A18C]/30 animate-in fade-in zoom-in-95 duration-300">
                   <p className="text-xs text-[#F5A18C] font-bold uppercase tracking-widest text-center">Inspiration confirmed. Welcome home.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-stone-400 mb-6 leading-relaxed">Receive curated monthly stories and early access to new drop arrivals.</p>
                  <form className="flex border-b-2 border-white/10 pb-2 group focus-within:border-[#F5A18C] transition-all" onSubmit={handleSubscribe}>
                    <input 
                      type="email" 
                      required
                      placeholder="artisan@citropoth.com" 
                      className="bg-transparent border-none px-0 py-2 text-sm w-full focus:ring-0 text-white placeholder:text-stone-700 font-bold uppercase tracking-widest"
                    />
                    <button type="submit" className="text-white hover:text-[#F5A18C] transition-all px-2 transform group-hover:translate-x-1">
                      <i className="fa-solid fa-arrow-right-long text-lg"></i>
                    </button>
                  </form>
                </>
              )}
              <div className="mt-10 flex flex-wrap items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/BKash_Logo.svg" alt="bKash" className="h-5" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0a/Nagad_Logo.svg" alt="Nagad" className="h-5" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest border border-white/20 px-2 py-1 rounded">SSL Secure</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.3em] text-stone-500 font-black gap-6">
            <p className="text-center md:text-left">© 2024 Citropoth Studio. Every Pixel Crafted with Soul.</p>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-[#F5A18C] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#F5A18C] transition-colors">Terms of Craft</a>
              <a href="#" className="hover:text-[#F5A18C] transition-colors">Sustainability</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;