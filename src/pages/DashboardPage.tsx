import { useEffect, useState } from 'react';
import { Loader2, User, Crown, Activity, Package, CreditCard, Calendar, TrendingUp, Dumbbell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { MemberSubscription, SupplementOrder, ProgressEntry, Payment, MembershipPlan } from '@/types';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<MemberSubscription | null>(null);
  const [orders, setOrders] = useState<SupplementOrder[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const [subRes, orderRes, progRes, payRes] = await Promise.all([
        supabase
          .from('member_subscriptions')
          .select('*, plan:membership_plans(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('supplement_orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('progress_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('workout_date', { ascending: false })
          .limit(5),
        supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setSubscription(subRes.data as MemberSubscription | null);
      setOrders((orderRes.data || []) as SupplementOrder[]);
      setProgress((progRes.data || []) as ProgressEntry[]);
      setPayments((payRes.data || []) as Payment[]);
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <User className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Member Dashboard</h2>
          <p className="text-neutral-400 mb-6">Sign in to view your membership, orders, progress, and payment history.</p>
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

  const totalSpent = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const latestProgress = progress[0];
  const hasActiveMembership = subscription?.status === 'active';

  return (
    <div className="pt-16">
      <section className="py-12 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0] || 'Member'}!</h1>
              <p className="text-neutral-400 mt-1">Here's an overview of your IronCore membership.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Membership status */}
          <div className={`rounded-2xl p-5 border ${hasActiveMembership ? 'bg-primary-500/10 border-primary-500/30' : 'bg-neutral-900 border-neutral-800'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-neutral-400">Membership</span>
            </div>
            {hasActiveMembership ? (
              <>
                <div className="text-xl font-bold">{(subscription as any)?.plan?.name || 'Active'}</div>
                {subscription?.end_date && (
                  <p className="text-xs text-neutral-500 mt-1">
                    Until {new Date(subscription.end_date).toLocaleDateString()}
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-neutral-400">No active plan</div>
                <button onClick={() => onNavigate('membership')} className="text-xs text-primary-500 mt-1 hover:underline">
                  Choose a plan →
                </button>
              </>
            )}
          </div>

          {/* Progress entries */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-400">Checkups Logged</span>
            </div>
            <div className="text-xl font-bold">{progress.length}</div>
            {latestProgress && (
              <p className="text-xs text-neutral-500 mt-1">
                Latest: {latestProgress.weight_kg ? `${latestProgress.weight_kg}kg` : '—'} on {new Date(latestProgress.workout_date).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Supplement orders */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-accent-500" />
              <span className="text-sm text-neutral-400">Supplement Orders</span>
            </div>
            <div className="text-xl font-bold">{orders.length}</div>
            <button onClick={() => onNavigate('supplements')} className="text-xs text-primary-500 mt-1 hover:underline">
              Browse supplements →
            </button>
          </div>

          {/* Total spent */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-neutral-400">Total Spent</span>
            </div>
            <div className="text-xl font-bold">KSh {totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent payments */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                Payment History
              </h3>
              <span className="text-xs text-neutral-500">{payments.length} transactions</span>
            </div>
            <div className="divide-y divide-neutral-800">
              {payments.length === 0 ? (
                <p className="p-5 text-center text-neutral-500 text-sm">No payments yet.</p>
              ) : (
                payments.map((payment) => (
                  <div key={payment.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{payment.payable_for.replace('_', ' ')}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(payment.created_at).toLocaleDateString()}
                        <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-neutral-800 capitalize">
                          {payment.method}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KSh {Number(payment.amount).toLocaleString()}</p>
                      <span className={`text-xs ${payment.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent progress */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Recent Progress
              </h3>
              <button onClick={() => onNavigate('progress')} className="text-xs text-primary-500 hover:underline">
                View all →
              </button>
            </div>
            <div className="divide-y divide-neutral-800">
              {progress.length === 0 ? (
                <div className="p-5 text-center">
                  <p className="text-neutral-500 text-sm mb-3">No progress entries yet.</p>
                  <button onClick={() => onNavigate('progress')} className="text-xs text-primary-500 hover:underline">
                    Log your first checkup →
                  </button>
                </div>
              ) : (
                progress.map((entry) => (
                  <div key={entry.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                        <span className="text-primary-500 font-bold text-xs">W{entry.week_number}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{new Date(entry.workout_date).toLocaleDateString()}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {entry.weight_kg && `${entry.weight_kg}kg`}
                          {entry.body_fat_pct && ` · ${entry.body_fat_pct}% BF`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Browse Programs', icon: Dumbbell, page: 'programs' },
            { label: 'Buy Supplements', icon: Package, page: 'supplements' },
            { label: 'Track Progress', icon: Activity, page: 'progress' },
            { label: 'Upgrade Plan', icon: Crown, page: 'membership' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-primary-500/40 transition-all hover:translate-y-[-2px] flex flex-col items-center gap-2"
            >
              <action.icon className="w-6 h-6 text-primary-500" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
