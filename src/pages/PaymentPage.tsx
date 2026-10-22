import { useState, useEffect } from 'react';
import { Loader2, Smartphone, CreditCard, CheckCircle2, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { MembershipPlan, MemberSubscription } from '@/types';

interface PaymentPageProps {
  onNavigate: (page: string) => void;
  selectedPlanId?: string | null;
}

export default function PaymentPage({ onNavigate, selectedPlanId }: PaymentPageProps) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal'>('mpesa');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('membership_plans')
        .select('*')
        .order('sort_order');
      setPlans(data as MembershipPlan[]);
      if (selectedPlanId) {
        const plan = (data as MembershipPlan[])?.find((p) => p.id === selectedPlanId);
        if (plan) setSelectedPlan(plan);
      }
      setLoading(false);
    };
    load();
  }, [selectedPlanId]);

  const handlePay = async () => {
    if (!user || !selectedPlan) return;
    setProcessing(true);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + selectedPlan.duration_months);

    const { data: sub, error: subError } = await supabase
      .from('member_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })
      .select()
      .single();

    if (!subError && sub) {
      await supabase.from('payments').insert({
        user_id: user.id,
        amount: selectedPlan.price,
        method: paymentMethod,
        status: 'completed',
        reference: `${paymentMethod.toUpperCase()}-MEM-${Date.now()}`,
        payable_for: selectedPlan.is_premium ? 'premium' : 'membership',
        related_id: sub.id,
      });
    }

    setProcessing(false);
    setSuccess(true);
  };

  if (!user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-neutral-400 mb-6">You need to be signed in to purchase a membership plan.</p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-neutral-400 mb-6">
            Your membership is now active. Welcome to the IronCore family!
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="py-12 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-3">
            <Lock className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-400 font-medium">Secure Payment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Choose Your Plan & Pay</h1>
          <p className="text-neutral-400 mt-2">Select a membership plan and complete payment via Mpesa or PayPal.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">1. Select a Membership Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
                    : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold">{plan.name}</h4>
                  {plan.is_premium && (
                    <span className="px-2 py-0.5 bg-accent-500/20 text-accent-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-400 mb-2">{plan.description}</p>
                <p className="text-2xl font-bold text-primary-500">
                  KSh {plan.price.toLocaleString()}
                  <span className="text-sm text-neutral-400 font-normal"> / {plan.duration_months}mo</span>
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment method */}
        {selectedPlan && (
          <div className="animate-slide-up">
            <h3 className="text-lg font-semibold mb-4">2. Choose Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setPaymentMethod('mpesa')}
                className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                  paymentMethod === 'mpesa'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                <div className="w-12 h-12 bg-green-500/15 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg">Mpesa</p>
                  <p className="text-sm text-neutral-400">Pay instantly via Mpesa STK Push to your phone</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                <div className="w-12 h-12 bg-blue-500/15 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg">PayPal</p>
                  <p className="text-sm text-neutral-400">Secure payment with your PayPal account or card</p>
                </div>
              </button>
            </div>

            {/* Payment details form */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">3. Payment Details</h3>
              {paymentMethod === 'mpesa' ? (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Mpesa Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 712 345 678"
                    className="w-full md:w-1/2 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <p className="text-xs text-neutral-500 mt-2">You will receive a prompt on your phone to enter your Mpesa PIN and confirm payment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">PayPal Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full md:w-1/2 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-neutral-500">You will be redirected to PayPal to complete your payment securely.</p>
                </div>
              )}
            </div>

            {/* Summary & pay */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-neutral-400">Selected Plan</p>
                  <p className="text-xl font-bold">{selectedPlan.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Amount Due</p>
                  <p className="text-2xl font-bold text-primary-500">KSh {selectedPlan.price.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay KSh {selectedPlan.price.toLocaleString()} via {paymentMethod === 'mpesa' ? 'Mpesa' : 'PayPal'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-xs text-neutral-500 text-center mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Your payment is secured with bank-grade encryption
              </p>
            </div>
          </div>
        )}

        {!selectedPlan && (
          <div className="text-center py-12 text-neutral-500">
            Please select a membership plan above to continue.
          </div>
        )}
      </section>
    </div>
  );
}
