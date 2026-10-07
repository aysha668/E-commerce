import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Check, 
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard({ onRefreshProducts }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Audio',
    stock: 10,
    image: '/images/headphones.jpg'
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/products'),
        fetch('/api/orders')
      ]);

      const statsData = await statsRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          category: 'Audio',
          stock: 10,
          image: '/images/headphones.jpg'
        });
        fetchAdminData();
        if (onRefreshProducts) onRefreshProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        setEditingProduct(null);
        fetchAdminData();
        if (onRefreshProducts) onRefreshProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchAdminData();
        if (onRefreshProducts) onRefreshProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Lumina Executive Control
          </div>
          <h2 className="text-3xl font-extrabold text-white brand-font">Admin Management Hub</h2>
          <p className="text-sm text-slate-400">Manage catalog products, live customer order status, and sales metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="gradient-btn px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
          
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            title="Refresh Admin Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Executive Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Product Management ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Order Tracking Manager ({orders.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
                <h3 className="text-2xl font-extrabold text-white brand-font mt-1">
                  ${Number(stats.totalRevenue).toFixed(2)}
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-3 h-3" /> Live SQLite Database
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customer Orders</p>
                <h3 className="text-2xl font-extrabold text-white brand-font mt-1">
                  {stats.totalOrders}
                </h3>
                <span className="text-[10px] text-indigo-400 flex items-center gap-1 mt-2">
                  Tracked Live
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Catalog Products</p>
                <h3 className="text-2xl font-extrabold text-white brand-font mt-1">
                  {stats.totalProducts}
                </h3>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  In Stock Items
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alerts</p>
                <h3 className="text-2xl font-extrabold text-amber-400 brand-font mt-1">
                  {stats.lowStockCount}
                </h3>
                <span className="text-[10px] text-amber-300 mt-2 block">
                  Stock &lt; 10 units
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Recent Orders Table */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white brand-font">Recent Store Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-bold text-white">{ord.id}</td>
                      <td className="py-3 px-4">{ord.customer_name} ({ord.user_email})</td>
                      <td className="py-3 px-4 font-extrabold text-indigo-300">${Number(ord.total_amount).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-950 text-xs text-white px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white brand-font">Product Catalog Table</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800"
                        onError={(e) => { e.target.src = '/images/headphones.jpg'; }}
                      />
                      <div>
                        <p className="font-bold text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{p.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">${Number(p.price).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${p.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:text-white hover:bg-slate-700"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-white hover:bg-rose-900/40"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white brand-font">Order Tracking Manager</h3>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400">{ord.id}</span>
                  <h4 className="text-sm font-bold text-white">{ord.customer_name} ({ord.user_email})</h4>
                  <p className="text-xs text-slate-400 mt-1">{ord.shipping_address}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-white">${Number(ord.total_amount).toFixed(2)}</span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="bg-slate-900 text-xs text-white font-bold px-3 py-1.5 rounded-xl border border-indigo-500/40 focus:outline-none"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade">
          <div className="relative w-full max-w-lg glass-card p-6 rounded-3xl border border-indigo-500/30 bg-slate-900/95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white brand-font">Add Product to Catalog</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Laptops">Laptops</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800 h-20"
                />
              </div>

              <button type="submit" className="w-full gradient-btn py-3 rounded-xl font-bold text-xs">
                Save & Publish Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade">
          <div className="relative w-full max-w-lg glass-card p-6 rounded-3xl border border-indigo-500/30 bg-slate-900/95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white brand-font">Edit Product #{editingProduct.id}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full gradient-btn py-3 rounded-xl font-bold text-xs">
                Update Product
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
