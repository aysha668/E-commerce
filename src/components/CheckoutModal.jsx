import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, MapPin, Truck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totals,
  currentUser,
  onOrderSuccess
}) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: currentUser ? currentUser.name : 'Alex Johnson',
    email: currentUser ? currentUser.email : 'user@lumina.com',
    phone: '+1 (555) 234-5678',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
    paymentMethod: 'card',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888'
  });

  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        user_email: formData.email,
        customer_name: formData.fullName,
        total_amount: totals.total,
        shipping_address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`,
        payment_method: formData.paymentMethod === 'card' ? `Credit Card (${formData.cardNumber.slice(-4)})` : 'UPI / Express Wallet',
        items: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        throw new Error('Failed to create order');
      }

      const newOrder = await res.json();
      setPlacedOrder(newOrder);
      setStep(3);
      onOrderSuccess(newOrder);
    } catch (err) {
      console.error(err);
      alert('Error placing order. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl bg-slate-900/95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white brand-font">256-Bit Encrypted Checkout</h3>
              <p className="text-xs text-slate-400">Step {step} of 3 • Lumina Secure Checkout</p>
            </div>
          </div>

          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Wizard Steps */}
        {step !== 3 && (
          <div className="grid grid-cols-2 text-center text-xs font-semibold border-b border-slate-800">
            <div className={`py-3 flex items-center justify-center gap-2 border-r border-slate-800 ${step === 1 ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-500'}`}>
              <MapPin className="w-4 h-4" /> 1. Shipping Address
            </div>
            <div className={`py-3 flex items-center justify-center gap-2 ${step === 2 ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-500'}`}>
              <CreditCard className="w-4 h-4" /> 2. Payment Gateway
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">

          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">Shipping & Contact Details</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">State & Zip Code</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="bg-slate-950 text-sm text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      className="bg-slate-950 text-sm text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <div className="text-xs text-slate-400">
                  Total: <span className="text-white font-bold">${totals.total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="gradient-btn px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT GATEWAY */}
          {step === 2 && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">Payment Gateway Simulation</h4>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-xs font-bold">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-400">Visa, Mastercard, Amex</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.paymentMethod === 'upi'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold">Express UPI / Wallet</p>
                    <p className="text-[10px] text-slate-400">Instant One-Click</p>
                  </div>
                </button>
              </div>

              {/* Card Inputs */}
              {formData.paymentMethod === 'card' && (
                <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full bg-slate-900 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleChange}
                        className="w-full bg-slate-900 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        className="w-full bg-slate-900 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  Back to Address
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-btn px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl"
                >
                  {isSubmitting ? (
                    'Processing Order...'
                  ) : (
                    <>Pay ${totals.total.toFixed(2)} & Place Order</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 3 && placedOrder && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white brand-font">Order Successfully Placed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Thank you for your purchase. Order ID: <span className="text-indigo-300 font-bold">{placedOrder.id}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Customer Email:</span>
                  <span className="text-white font-semibold">{placedOrder.user_email}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping Address:</span>
                  <span className="text-white font-semibold truncate max-w-xs">{placedOrder.shipping_address}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-400 font-bold">${placedOrder.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Live Tracking Status:</span>
                  <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-bold border border-indigo-500/30">
                    {placedOrder.status}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full gradient-btn py-3.5 rounded-xl font-bold text-xs shadow-lg"
              >
                Track My Order Now
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
