import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User, 
  ShieldCheck, 
  Package, 
  Store, 
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  cartCount,
  wishlistCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
  onLogout,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e8e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setCurrentView('store')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#5d6e42] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold brand-font text-[#1d2417] tracking-tight">
                ShopMate
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f3eee4] p-1.5 rounded-full border border-[#e8e6df]">
            <button
              onClick={() => setCurrentView('store')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                currentView === 'store'
                  ? 'bg-[#5d6e42] text-white shadow-md'
                  : 'text-[#606857] hover:text-[#1d2417] hover:bg-white/60'
              }`}
            >
              <Store className="w-4 h-4" />
              Home & Products
            </button>

            <button
              onClick={() => setCurrentView('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                currentView === 'orders'
                  ? 'bg-[#5d6e42] text-white shadow-md'
                  : 'text-[#606857] hover:text-[#1d2417] hover:bg-white/60'
              }`}
            >
              <Package className="w-4 h-4" />
              Track Orders
            </button>

            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  currentView === 'admin'
                    ? 'bg-[#1d2417] text-white shadow-md'
                    : 'text-[#5d6e42] hover:bg-white/60 border border-[#5d6e42]/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Search Bar (Store View) */}
          {currentView === 'store' && (
            <div className="flex-1 max-w-xs hidden lg:block relative">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e9686]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f7f6f2] text-xs text-[#1d2417] placeholder-[#8e9686] pl-10 pr-4 py-2.5 rounded-full border border-[#e8e6df] focus:outline-none focus:border-[#5d6e42] transition-all"
                />
              </div>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-3">

            {/* Wishlist */}
            <button 
              onClick={() => setCurrentView('store')}
              className="relative p-2.5 rounded-xl bg-[#f7f6f2] text-[#1d2417] hover:bg-[#e8e6df] border border-[#e8e6df] transition-all hidden sm:flex"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5d6e42] text-white font-bold text-xs shadow-md hover:bg-[#4a5933] transition-all group"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#5d6e42] text-xs font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Account Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#e8e6df]">
                <div className="flex items-center gap-2 bg-[#f7f6f2] px-3 py-1.5 rounded-xl border border-[#e8e6df]">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    currentUser.role === 'admin' 
                      ? 'bg-[#1d2417] text-white' 
                      : 'bg-[#5d6e42] text-white'
                  }`}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-[#1d2417] leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-[#606857] capitalize">{currentUser.role} Mode</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-[#606857] hover:text-rose-600 hover:bg-[#f7f6f2] transition-all"
                  title="Switch Role / Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}
