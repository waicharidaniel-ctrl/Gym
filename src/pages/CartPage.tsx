import { useState } from 'react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2, CheckCircle2, Smartphone, CreditCard } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal'>('mpesa');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    if (items.length === 0) return;

    setProcessing(true);

    const { data: order, error: orderError } = await supabase
      .from('supplement_orders')
      .insert({
        user_id: user.id,
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: 'paid',
        status: 'processing',
      })
      .select()
      .single();

    if (orderError || !order) {
      setProcessing(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      supplement_id: item.supplement.id,
      quantity: item.quantity,
      unit_price: item.supplement.price,
    }));

    await supabase.from('supplement_order_items').insert(orderItems);

    await supabase.from('payments').insert({
      user_id: user.id,
      amount: total,
      method: paymentMethod,
      status: 'completed',
      reference: `${paymentMethod.toUpperCase()}-${Date.now()}`,
      payable_for: 'supplement',
      related_id: order.id,
    });

    setOrderId(order.id);
    setSuccess(true);
    clearCart();
    setProcessing(false);
  };

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-neutral-400 mb-2">
            Your supplement order has been confirmed and is being processed.
          </p>
          {orderId && (
            <p className="text-sm text-neutral-500 mb-6">Order ID: {orderId.slice(0, 8)}</p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onNavigate('supplements')}
              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-neutral-400 mb-6">Browse our supplement store and add items to your cart.</p>
          <button
            onClick={() => onNavigate('supplements')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Browse Supplements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="py-12 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart & Checkout</h1>
          <p className="text-neutral-400 mt-2">Review your items and choose your payment method.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.supplement.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-neutral-800 rounded-xl flex-shrink-0 overflow-hidden">
                  {item.supplement.image_url && (
                    <img src={item.supplement.image_url} alt={item.supplement.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.supplement.name}</h3>
                  <p className="text-sm text-neutral-400">{item.supplement.category}</p>
                  <p className="text-primary-500 font-bold mt-1">KSh {item.supplement.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.supplement.id, item.quantity - 1)}
                    className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.supplement.id, item.quantity + 1)}
                    className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold">KSh {(item.supplement.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(item.supplement.id)}
                    className="text-neutral-500 hover:text-primary-500 transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment method */}
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-300 mb-2">Payment Method</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-primary-500" />
                    <div className="text-left">
                      <p className="text-sm font-semibold">Mpesa</p>
                      <p className="text-xs text-neutral-400">Pay via Mpesa STK Push</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <p className="text-sm font-semibold">PayPal</p>
                      <p className="text-xs text-neutral-400">Pay with your PayPal account</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing || !user}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : !user ? (
                  'Sign In to Checkout'
                ) : (
                  <>
                    Complete Order
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {!user && (
                <p className="text-xs text-neutral-500 text-center mt-3">
                  You need to be signed in to complete your purchase.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
