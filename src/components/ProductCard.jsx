import React from 'react';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';

export default function ProductCard({
  product,
  onAddToCart,
  onSelectProduct,
  isWishlisted,
  onToggleWishlist
}) {
  const isOutOfStock = product.stock <= 0;
  const originalPrice = (Number(product.price) * 1.35).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-[#e8e6df] hover:border-[#c4cca6] hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Product Image & Badges */}
      <div 
        className="relative aspect-square w-full bg-[#f4f3ee] overflow-hidden cursor-pointer flex items-center justify-center p-4"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image || '/images/headphones.jpg'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-xl"
          onError={(e) => {
            e.target.src = '/images/headphones.jpg';
          }}
        />

        {/* Heart Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm border transition-all ${
            isWishlisted
              ? 'text-rose-500 border-rose-200 bg-rose-50 scale-110'
              : 'text-[#8e9686] border-[#e8e6df] hover:text-rose-500'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="px-4 py-2 rounded-full bg-white text-[#1d2417] text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-[#5d6e42] hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-[#1d2417] group-hover:text-[#5d6e42] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-[#1d2417]">{product.rating || 4.8}</span>
            <span className="text-xs text-[#8e9686]">({product.review_count || 64})</span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base font-extrabold text-[#1d2417] brand-font">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-xs text-[#8e9686] line-through font-normal">
              ${originalPrice}
            </span>
          </div>
        </div>

        {/* Add to Cart Full Width Olive Green Button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            isOutOfStock
              ? 'bg-[#e8e6df] text-[#8e9686] cursor-not-allowed'
              : 'gradient-btn shadow-sm'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>

      </div>

    </div>
  );
}
