import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTracking from './components/OrderTracking';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { 
  Sparkles, 
  ArrowRight, 
  Store, 
  Headphones, 
  Shirt, 
  Armchair, 
  Sparkle, 
  Footprints, 
  Watch,
  Quote,
  Star,
  Send
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('store'); // store, orders, admin
  
  // Auth User State (Default: Alex Johnson - User)
  const [currentUser, setCurrentUser] = useState({
    id: 2,
    name: 'Alex Johnson',
    email: 'user@lumina.com',
    role: 'user'
  });

  // Catalog Products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Shopping Cart & Wishlist State
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Modals Control
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [checkoutTotals, setCheckoutTotals] = useState({ subtotal: 0, discountAmount: 0, shipping: 0, total: 0 });

  // Fetch Products from API
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products from backend:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Cart Handlers
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleProceedToCheckout = (totals) => {
    setCheckoutTotals(totals);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const circularCategories = [
    { name: 'Electronics', icon: Headphones, bg: 'bg-[#e9eef2]' },
    { name: 'Fashion', icon: Shirt, bg: 'bg-[#f6ebec]' },
    { name: 'Home & Kitchen', icon: Armchair, bg: 'bg-[#f8f3e6]' },
    { name: 'Beauty', icon: Sparkle, bg: 'bg-[#f2eaf7]' },
    { name: 'Sports', icon: Footprints, bg: 'bg-[#e6f4f2]' },
    { name: 'Accessories', icon: Watch, bg: 'bg-[#f6efe9]' },
  ];

  const filteredProducts = products.sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f2] text-[#1d2417] font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* VIEW 1: STOREFRONT */}
      {currentView === 'store' && (
        <main className="flex-1 space-y-16 pb-16">
          
          {/* Section 1: Hero Banner & 4 Features */}
          <Hero onExploreClick={() => {
            const el = document.getElementById('best-selling-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />

          {/* Section 2: Shop by Categories (Circular Avatars) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold brand-font text-[#1d2417]">Shop by Categories</h2>
              <button 
                onClick={() => setSelectedCategory('All')}
                className="text-xs font-bold text-[#5d6e42] hover:underline flex items-center gap-1"
              >
                View All Categories <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
              {circularCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.name;

                return (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="cursor-pointer group flex flex-col items-center gap-3"
                  >
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${cat.bg} flex items-center justify-center border-2 transition-all ${
                      isSelected ? 'border-[#5d6e42] scale-105 shadow-md' : 'border-transparent group-hover:scale-105'
                    }`}>
                      <IconComponent className="w-8 h-8 text-[#5d6e42]" />
                    </div>
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#5d6e42]' : 'text-[#1d2417]'}`}>
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 3: Best Selling Products Grid */}
          <section id="best-selling-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e6df] pb-4">
              <div>
                <h2 className="text-2xl font-bold brand-font text-[#1d2417]">Best Selling Products</h2>
                <p className="text-xs text-[#8e9686] mt-0.5">Showing top trending items with free express delivery</p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#e8e6df] text-xs">
                <span className="text-[#8e9686] font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[#1d2417] font-bold focus:outline-none"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {loadingProducts ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-[#5d6e42] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#8e9686]">Loading products from backend API...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#e8e6df] space-y-3">
                <Store className="w-10 h-10 text-[#8e9686] mx-auto" />
                <h3 className="text-base font-bold text-[#1d2417]">No products matching current filter</h3>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Section 4: Special Offer Promotional Banner */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#f3eee4] rounded-[32px] p-8 sm:p-12 border border-[#e2e0d5] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-lg">
                <span className="text-xs font-extrabold text-[#5d6e42] uppercase tracking-wider">Special Offer</span>
                <h2 className="text-4xl font-extrabold text-[#1d2417] brand-font">Up to 50% Off</h2>
                <p className="text-sm text-[#606857] leading-relaxed">
                  Limited time offer on selected items. Hurry up and grab the best deals on premium lifestyle & audio gear!
                </p>
                <button
                  onClick={() => {
                    const el = document.getElementById('best-selling-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="gradient-btn px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  Shop the Sale <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                <img
                  src="/images/hero_podium.jpg"
                  alt="Special Offer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </section>

          {/* Section 5: What Our Customers Say (Testimonials) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-2xl font-bold brand-font text-center text-[#1d2417]">What Our Customers Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#e8e6df] shadow-sm space-y-4">
                <Quote className="w-6 h-6 text-[#5d6e42]" />
                <p className="text-xs text-[#606857] leading-relaxed font-medium">
                  "Amazing products and fast delivery! ShopMate is my go-to store for all my lifestyle and tech needs."
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#f4f3ee]">
                  <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="John D." />
                  <div>
                    <h4 className="text-xs font-bold text-[#1d2417]">John D.</h4>
                    <div className="flex text-amber-400 text-[10px]">★★★★★</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e8e6df] shadow-sm space-y-4">
                <Quote className="w-6 h-6 text-[#5d6e42]" />
                <p className="text-xs text-[#606857] leading-relaxed font-medium">
                  "Great quality at affordable prices. The customer support is also very responsive and helpful."
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#f4f3ee]">
                  <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Sarah M." />
                  <div>
                    <h4 className="text-xs font-bold text-[#1d2417]">Sarah M.</h4>
                    <div className="flex text-amber-400 text-[10px]">★★★★★</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e8e6df] shadow-sm space-y-4">
                <Quote className="w-6 h-6 text-[#5d6e42]" />
                <p className="text-xs text-[#606857] leading-relaxed font-medium">
                  "Very happy with my purchase. Highly recommend ShopMate to everyone looking for reliable quality!"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#f4f3ee]">
                  <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Michael T." />
                  <div>
                    <h4 className="text-xs font-bold text-[#1d2417]">Michael T.</h4>
                    <div className="flex text-amber-400 text-[10px]">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* VIEW 2: ORDER TRACKING */}
      {currentView === 'orders' && (
        <main className="flex-1">
          <OrderTracking
            currentUser={currentUser}
            onBackToStore={() => setCurrentView('store')}
          />
        </main>
      )}

      {/* VIEW 3: ADMIN DASHBOARD */}
      {currentView === 'admin' && (
        <main className="flex-1">
          <AdminDashboard
            onRefreshProducts={fetchProducts}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#e8e6df] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-[#606857]">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#5d6e42] flex items-center justify-center text-white font-bold text-xs">
                S
              </div>
              <span className="text-lg font-bold text-[#1d2417] brand-font">ShopMate</span>
            </div>
            <p className="leading-relaxed">
              Your one-stop shop for quality lifestyle products at the best prices.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1d2417] mb-3 uppercase tracking-wider text-[11px]">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('store')} className="hover:text-[#5d6e42]">Home & Store</button></li>
              <li><button onClick={() => setCurrentView('orders')} className="hover:text-[#5d6e42]">Track Order</button></li>
              <li><button onClick={() => setCurrentView('admin')} className="hover:text-[#5d6e42]">Admin Dashboard</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1d2417] mb-3 uppercase tracking-wider text-[11px]">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#5d6e42]">Help Center & FAQ</a></li>
              <li><a href="#" className="hover:text-[#5d6e42]">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#5d6e42]">Returns & Refunds</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#1d2417] uppercase tracking-wider text-[11px]">Subscribe to Newsletter</h4>
            <p className="leading-relaxed">Get latest updates on new products and upcoming sales.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to ShopMate Newsletter!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#f7f6f2] text-xs text-[#1d2417] px-3 py-2 rounded-xl border border-[#e8e6df] flex-1 focus:outline-none"
                required
              />
              <button type="submit" className="gradient-btn px-3 py-2 rounded-xl">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </footer>

      {/* MODALS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={() => {
          setSelectedProduct(null);
          setIsCartOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totals={checkoutTotals}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            setCurrentView('admin');
          }
        }}
      />

    </div>
  );
}
