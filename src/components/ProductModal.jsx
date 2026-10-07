import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Shield, Truck, RotateCcw, Plus, Minus, Check, MessageSquare, Send } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart, onBuyNow }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ author_name: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      fetch(`/api/products/${product.id}/reviews`)
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(err => console.error(err));
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuy = () => {
    onAddToCart(product, quantity);
    onBuyNow();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.author_name || !newReview.comment) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });

      if (res.ok) {
        const addedRev = await res.json();
        setReviews([addedRev, ...reviews]);
        setNewReview({ author_name: '', rating: 5, comment: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade">
      <div className="relative w-full max-w-4xl glass-card rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl bg-slate-900/95 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Left Image View */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square flex items-center justify-center">
            <img
              src={product.image || '/images/headphones.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = '/images/headphones.jpg';
              }}
            />
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {product.category}
            </span>
          </div>

          {/* Right Product Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 text-sm font-bold text-amber-300">{product.rating || 4.8}</span>
                </div>
                <span className="text-xs text-slate-400">({product.review_count || reviews.length} customer reviews)</span>
              </div>

              <h2 className="text-2xl font-bold text-white brand-font leading-tight">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white brand-font">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  In Stock ({product.stock} units left)
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2 py-3 border-y border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-400" />
                <span>Free Express Worldwide Courier Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>2-Year Official Manufacturer Warranty Included</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-violet-400" />
                <span>30-Day Money-Back Risk-Free Guarantee</span>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Select Quantity:</span>
                <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-white px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    added
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-white hover:bg-slate-700 border-slate-700'
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuy}
                  className="gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  Instant Checkout
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <div className="p-6 sm:p-8 border-t border-slate-800 bg-slate-950/60 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white brand-font flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Verified Customer Reviews ({reviews.length})
            </h3>
          </div>

          {/* Add Review Form */}
          <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-semibold text-slate-300">Write a Review for {product.name}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.author_name}
                onChange={(e) => setNewReview({ ...newReview, author_name: e.target.value })}
                className="bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                required
              />
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-slate-400">Rating:</span>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="bg-transparent text-amber-400 font-bold focus:outline-none"
                >
                  <option value={5}>5 ★★★★★ (Excellent)</option>
                  <option value={4}>4 ★★★★☆ (Good)</option>
                  <option value={3}>3 ★★★☆☆ (Average)</option>
                  <option value={2}>2 ★★☆☆☆ (Fair)</option>
                  <option value={1}>1 ★☆☆☆☆ (Poor)</option>
                </select>
              </div>
            </div>

            <textarea
              placeholder="Share your experience with this tech product..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 h-16"
              required
            />

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="gradient-btn px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 ml-auto"
            >
              <Send className="w-3.5 h-3.5" /> Submit Review
            </button>
          </form>

          {/* Existing Reviews List */}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rev.author_name}</span>
                    <div className="flex items-center text-amber-400 font-bold">
                      {'★'.repeat(rev.rating)}
                      <span className="text-slate-600 font-normal ml-1">({rev.rating}/5)</span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
