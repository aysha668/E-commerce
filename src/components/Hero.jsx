import React from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <div className="pt-6 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Card Container */}
        <div className="bg-[#efeee9] rounded-[32px] p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-[#e2e0d5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e2e0d5] text-[#5d6e42] text-xs font-extrabold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#5d6e42]" />
                NEW ARRIVALS
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1d2417] leading-[1.15] brand-font">
                Discover The Best <br />
                Products for You
              </h1>

              {/* Subtitle */}
              <p className="text-[#606857] text-base sm:text-lg max-w-lg font-normal leading-relaxed">
                Explore our wide range of high-quality products at affordable prices. Shop now and enjoy the best deals!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onExploreClick}
                  className="gradient-btn px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreClick}
                  className="outline-btn px-6 py-3.5 rounded-xl font-semibold text-sm"
                >
                  Explore Deals
                </button>
              </div>

              {/* Customer Proof */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#e2e0d5]/80">
                <div className="flex -space-x-2">
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                </div>
                <p className="text-xs font-bold text-[#606857]">
                  Trusted by <span className="text-[#1d2417]">10,000+</span> Happy Customers
                </p>
              </div>

            </div>

            {/* Right Side Podium Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-[28px] overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/images/hero_podium.jpg"
                  alt="ShopMate Featured Products"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 4 Feature Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#e8e6df] shadow-sm">
            <div className="p-3 rounded-full bg-[#f3eee4] text-[#5d6e42]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#1d2417]">Free Shipping</h5>
              <p className="text-[11px] text-[#8e9686]">On orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#e8e6df] shadow-sm">
            <div className="p-3 rounded-full bg-[#f3eee4] text-[#5d6e42]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#1d2417]">Secure Payment</h5>
              <p className="text-[11px] text-[#8e9686]">100% secure payment</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#e8e6df] shadow-sm">
            <div className="p-3 rounded-full bg-[#f3eee4] text-[#5d6e42]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#1d2417]">Easy Returns</h5>
              <p className="text-[11px] text-[#8e9686]">30 days return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#e8e6df] shadow-sm">
            <div className="p-3 rounded-full bg-[#f3eee4] text-[#5d6e42]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#1d2417]">24/7 Support</h5>
              <p className="text-[11px] text-[#8e9686]">Dedicated support team</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
