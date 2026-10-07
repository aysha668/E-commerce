import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, RefreshCw, ShoppingBag, ArrowRight, Printer } from 'lucide-react';

export default function OrderTracking({ currentUser, onBackToStore }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userEmail = currentUser ? currentUser.email : 'user@lumina.com';
      const res = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const handlePrintReceipt = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">LUMINA STORES INVOICE</div>
              <p>Order Reference: <strong>${order.id}</strong></p>
              <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p>Customer: <strong>${order.customer_name}</strong></p>
              <p>Email: ${order.user_email}</p>
              <p>Address: ${order.shipping_address}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${(order.items || []).map(i => `
                <tr>
                  <td>${i.product_name}</td>
                  <td>${i.quantity}</td>
                  <td>$${Number(i.price).toFixed(2)}</td>
                  <td>$${(i.price * i.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total Paid: $${Number(order.total_amount).toFixed(2)}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const stages = [
    { title: 'Placed', icon: Clock, desc: 'Order received & confirmed' },
    { title: 'Processing', icon: Package, desc: 'Quality checked & packed' },
    { title: 'Shipped', icon: Truck, desc: 'In transit with courier' },
    { title: 'Delivered', icon: CheckCircle2, desc: 'Handed to customer' }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Refresh Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white brand-font flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-400" />
            Live Order Tracking Hub
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status updates for orders registered under <span className="text-indigo-300 font-semibold">{currentUser ? currentUser.email : 'user@lumina.com'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>

          <button
            onClick={onBackToStore}
            className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            Back to Shop <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Syncing live order tracking database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center mx-auto border border-slate-800">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No active orders found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't placed any orders yet. Place an order from the product catalog to track delivery in real time!
          </p>
          <button
            onClick={onBackToStore}
            className="gradient-btn px-6 py-3 rounded-xl font-bold text-xs inline-flex items-center gap-2"
          >
            Browse Products Now
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const currentStageIdx = getStageIndex(order.status);

            return (
              <div
                key={order.id}
                className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Reference</span>
                    <h3 className="text-xl font-extrabold text-white brand-font flex items-center gap-2">
                      {order.id}
                      <span className="text-xs font-normal text-slate-400">
                        • {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePrintReceipt(order)}
                      className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 flex items-center gap-1.5 text-xs font-semibold transition-all"
                      title="Print Official Order Invoice"
                    >
                      <Printer className="w-4 h-4 text-indigo-400" />
                      <span className="hidden sm:inline">Print Receipt</span>
                    </button>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total Amount</p>
                      <p className="text-lg font-extrabold text-indigo-300 brand-font">
                        ${Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/40">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* 4-Stage Visual Progress Bar */}
                <div className="py-4">
                  <div className="grid grid-cols-4 gap-2 relative">
                    
                    {/* Background Progress Line */}
                    <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-slate-800 -z-0" />
                    <div 
                      className="absolute top-5 left-[12%] h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 -z-0"
                      style={{ width: `${(currentStageIdx / 3) * 76}%` }}
                    />

                    {stages.map((stg, index) => {
                      const IconComponent = stg.icon;
                      const isDone = index <= currentStageIdx;
                      const isCurrent = index === currentStageIdx;

                      return (
                        <div key={stg.title} className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
                              isDone
                                ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-lg scale-110'
                                : 'bg-slate-900 text-slate-600 border-slate-800'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          
                          <p className={`mt-3 text-xs font-bold ${isDone ? 'text-white' : 'text-slate-500'}`}>
                            {stg.title}
                          </p>
                          <p className="text-[10px] text-slate-400 hidden sm:block max-w-[120px] mt-0.5">
                            {stg.desc}
                          </p>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Order Items & Shipping Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80">
                  
                  {/* Items List */}
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</h4>
                    <div className="space-y-2">
                      {order.items && order.items.map((item) => (
                        <div
                          key={item.id || item.product_name}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || '/images/headphones.jpg'}
                              alt={item.product_name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800"
                              onError={(e) => {
                                e.target.src = '/images/headphones.jpg';
                              }}
                            />
                            <div>
                              <p className="text-xs font-bold text-white">{item.product_name}</p>
                              <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Delivery Address
                    </h4>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-white">{order.customer_name}</p>
                      <p className="text-slate-400 leading-relaxed">{order.shipping_address}</p>
                      <p className="text-slate-400 pt-2 border-t border-slate-800/80">
                        Payment: <span className="text-slate-300 font-semibold">{order.payment_method}</span>
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
