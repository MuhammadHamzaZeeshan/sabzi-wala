import React, { useState, useEffect } from 'react';
import { ShoppingBag, Store, Tag, PlusCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [listings, setListings] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form/Modal States
  const [selectedListing, setSelectedListing] = useState(null);
  const [quantity, setQuantity] = useState(5);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch data from our Django REST API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [listingsRes, productsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listings/`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/`)
      ]);

      if (!listingsRes.ok || !productsRes.ok) throw new Error('Failed to communicate with API');

      const listingsData = await listingsRes.json();
      const productsData = await productsRes.json();

      setListings(listingsData);
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError('Could not connect to the Sabzi-Wala Backend. Make sure your Django server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Booking form submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailer: 2, // Temporary hardcoded user ID for testing Phase 1
          listing: selectedListing.id,
          quantity_kg: parseInt(quantity)
        })
      });

      if (!response.ok) throw new Error('Order placement failed');

      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setSelectedListing(null);
        setQuantity(5);
      }, 3000);
    } catch (err) {
      alert('Error booking order. Check your terminal output.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Banner */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-emerald-100" />
            <h1 className="text-xl font-bold tracking-wide">Sabzi-Wala</h1>
          </div>
          <button onClick={fetchData} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6 text-red-700 shadow-sm">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-2"></div>
            <p className="text-slate-500">Loading live Mandi rates...</p>
          </div>
        ) : (
          <>
            {/* Live Feed Market Directory Title */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Live Rates</h2>  
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                {listings.length} Active Listings
              </span>
            </div>

            {/* Price Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden transition-all flex flex-col justify-between">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        item.product.category === 'FRUIT' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.product.category}
                      </span>
                      <div className="flex items-center text-slate-400 text-xs">
                        <Store className="h-3.5 w-3.5 mr-1" />
                        <span className="truncate max-w-[150px] font-medium">{item.wholesaler}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-1">{item.product.product_name}</h3>
                    
                    <div className="my-4 flex items-baseline">
                      <span className="text-3xl font-black text-slate-900">{parseFloat(item.price_per_kg).toFixed(0)}</span>
                      <span className="text-sm font-semibold text-slate-500 ml-1">PKR / KG</span>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0">
                    <button
                      onClick={() => setSelectedListing(item)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors group shadow-sm shadow-emerald-100"
                    >
                      <span>Book Instantly</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Booking Form Overlay Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in duration-200">
            {orderSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-800 mb-1">Booking Confirmed!</h3>
                <p className="text-slate-500 text-sm">Invoice saved dynamically to PostgreSQL.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Confirm Wholesale Purchase</h3>
                    <p className="text-xs text-slate-400">Buying from: {selectedListing.wholesaler}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedListing(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-semibold px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Commodity:</span>
                    <span className="font-bold text-slate-800">{selectedListing.product.product_name}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Mandi Rate:</span>
                    <span className="font-bold text-slate-800">{parseFloat(selectedListing.price_per_kg).toFixed(0)} PKR/KG</span>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Required Quantity (KG)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-medium text-slate-500">Estimated Total:</span>
                    <span className="text-2xl font-black text-emerald-600">
                      {(parseFloat(selectedListing.price_per_kg) * (parseInt(quantity) || 0)).toLocaleString()} PKR
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-emerald-100"
                  >
                    Send Order to Backend
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}