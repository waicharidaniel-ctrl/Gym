import { useEffect, useState } from 'react';
import { Check, Crown, Star, Zap, Loader2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { MembershipPlan, MemberSubscription } from '@/types';

interface MembershipPageProps {
  onNavigate: (page: string) => void;
}

const planIcons: Record<string, typeof Crown> = {
  Basic: Zap,
  Premium: Star,
  Elite: Crown,
  'Pro Athlete': Crown,
};

export default function MembershipPage({ onNavigate }: MembershipPageProps) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [subscription, setSubscription] = useState<MemberSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectingPlan, setSelectingPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: plansData } = await supabase
        .from('membership_plans')
        .select('*')
        .order('sort_order');
      setPlans(plansData as MembershipPlan[]);

      if (user) {
        const { data: subData } = await supabase
          .from('member_subscriptions')
          .select('*, plan:membership_plans(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        setSubscription(subData as MemberSubscription | null);
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  const handleSelectPlan = async (plan: MembershipPlan) => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    setSelectingPlan(plan.id);
    onNavigate('payment');
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-4">
            <Crown className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-400 font-medium">Membership Plans</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            Choose Your <span className="text-primary-500">Membership</span>
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Flexible plans designed for every fitness level. Premium services included in higher tiers for those serious about their transformation.
          </p>
        </div>
      </section>

      {/* Current subscription */}
      {subscription && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-primary-400 font-medium">Your Current Plan</p>
              <p className="text-xl font-bold mt-1">{subscription.plan?.name}</p>
              <p className="text-sm text-neutral-400 mt-1">
                Status: <span className="capitalize text-white">{subscription.status}</span>
                {subscription.end_date && ` · Expires ${new Date(subscription.end_date).toLocaleDateString()}`}
              </p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </section>
      )}

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => {
            const Icon = planIcons[plan.name] || Zap;
            const isPopular = plan.name === 'Elite';
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 transition-all hover:translate-y-[-4px] animate-fade-in ${
                  isPopular
                    ? 'border-primary-500 bg-gradient-to-b from-primary-500/10 to-neutral-900'
                    : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                {plan.is_premium && !isPopular && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-accent-500/20 text-accent-400 text-xs font-medium rounded-full">
                    PREMIUM
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  isPopular ? 'bg-primary-500/20' : 'bg-neutral-800'
                }`}>
                  <Icon className={`w-6 h-6 ${isPopular ? 'text-primary-500' : 'text-neutral-400'}`} />
                </div>

                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-neutral-400 mt-1 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold">KSh {plan.price.toLocaleString()}</span>
                  <span className="text-sm text-neutral-400"> / {plan.duration_months}mo</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-300">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={selectingPlan === plan.id}
                  className={`w-full py-3 font-semibold rounded-xl transition-all ${
                    isPopular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white hover:scale-[1.02]'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                  } disabled:opacity-50`}
                >
                  {selectingPlan === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : !user ? (
                    'Sign In to Subscribe'
                  ) : (
                    'Select Plan'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Premium services highlight */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Personal Training', desc: 'One-on-one sessions with certified trainers who design your program around your goals.' },
            { title: 'Nutrition Consultation', desc: 'Work with our nutritionists to build a meal plan that complements your training.' },
            { title: 'Recovery & Wellness', desc: 'Sauna, steam room, massage therapy, and physio sessions to keep you performing at your best.' },
          ].map((service) => (
            <div key={service.title} className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-accent-500" />
                <h4 className="text-lg font-semibold">{service.title}</h4>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{service.desc}</p>
              <p className="text-xs text-accent-500 mt-3 font-medium">Available with Premium plans and above</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
