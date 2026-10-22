import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, DollarSign, Users, Package, Crown, Dumbbell, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Revenue } from '@/types';

interface RevenuePageProps {
  onNavigate: (page: string) => void;
}

const sourceConfig = [
  { key: 'membership', label: 'Membership', icon: Users, color: 'rgb(239 68 68)', bg: 'bg-primary-500/10' },
  { key: 'supplement', label: 'Supplements', icon: Package, color: 'rgb(249 115 22)', bg: 'bg-accent-500/10' },
  { key: 'premium', label: 'Premium Services', icon: Crown, color: 'rgb(59 130 246)', bg: 'bg-blue-500/10' },
  { key: 'personal_training', label: 'Personal Training', icon: Dumbbell, color: 'rgb(34 197 94)', bg: 'bg-green-500/10' },
];

export default function RevenuePage({ onNavigate }: RevenuePageProps) {
  const { user } = useAuth();
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('revenue')
        .select('*')
        .order('month_year', { ascending: true });
      setRevenue((data || []) as Revenue[]);
      setLoading(false);
    };
    load();
  }, []);

  if (!user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BarChart3 className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Gym Revenue Dashboard</h2>
          <p className="text-neutral-400 mb-6">Sign in to view the gym's financial performance and revenue breakdown.</p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Sign In to Continue
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

  const totalRevenue = revenue.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalTransactions = revenue.reduce((sum, r) => sum + r.transaction_count, 0);

  const bySource = sourceConfig.map((src) => {
    const sourceRevenue = revenue.filter((r) => r.source === src.key);
    return {
      ...src,
      total: sourceRevenue.reduce((sum, r) => sum + Number(r.amount), 0),
      transactions: sourceRevenue.reduce((sum, r) => sum + r.transaction_count, 0),
    };
  });

  const months = Array.from(new Set(revenue.map((r) => r.month_year))).sort();
  const recentMonths = months.slice(-6);
  const monthlyTotals = recentMonths.map((month) => {
    const monthRevenue = revenue.filter((r) => r.month_year === month);
    return {
      month,
      total: monthRevenue.reduce((sum, r) => sum + Number(r.amount), 0),
      breakdown: sourceConfig.map((src) => {
        const entry = monthRevenue.find((r) => r.source === src.key);
        return { ...src, amount: entry ? Number(entry.amount) : 0 };
      }),
    };
  });

  const maxMonthly = Math.max(...monthlyTotals.map((m) => m.total), 1);

  const formatKSh = (amount: number) => `KSh ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="pt-16">
      <section className="py-12 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-3">
            <DollarSign className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-400 font-medium">Revenue Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Gym Money Making Progress</h1>
          <p className="text-neutral-400 mt-2">Track the gym's financial growth across all revenue streams.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Total stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary-500/15 to-neutral-900 border border-primary-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-neutral-400">Total Revenue ({months.length} months)</span>
            </div>
            <div className="text-3xl font-bold">{formatKSh(totalRevenue)}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-400">Total Transactions</span>
            </div>
            <div className="text-3xl font-bold">{totalTransactions.toLocaleString()}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-neutral-400">Avg Monthly Revenue</span>
            </div>
            <div className="text-3xl font-bold">{formatKSh(totalRevenue / months.length)}</div>
          </div>
        </div>

        {/* Revenue by source */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {bySource.map((src) => (
            <div key={src.key} className={`border border-neutral-800 rounded-2xl p-5 ${src.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <src.icon className="w-5 h-5" style={{ color: src.color }} />
                <span className="text-sm font-medium text-neutral-300">{src.label}</span>
              </div>
              <div className="text-2xl font-bold">{formatKSh(src.total)}</div>
              <div className="text-xs text-neutral-500 mt-1">{src.transactions.toLocaleString()} transactions</div>
              <div className="mt-3 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(src.total / totalRevenue) * 100}%`, backgroundColor: src.color }}
                />
              </div>
              <div className="text-xs text-neutral-500 mt-1">{((src.total / totalRevenue) * 100).toFixed(1)}% of total</div>
            </div>
          ))}
        </div>

        {/* Monthly chart */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Monthly Revenue Trend (Last 6 Months)
          </h3>
          <div className="flex items-end justify-between gap-3" style={{ height: 240 }}>
            {monthlyTotals.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-neutral-300">{formatKSh(month.total)}</div>
                <div className="w-full flex flex-col-reverse rounded-lg overflow-hidden" style={{ height: 180 }}>
                  {month.breakdown.map((bd) => {
                    const heightPct = (bd.amount / maxMonthly) * 100;
                    if (heightPct === 0) return null;
                    return (
                      <div
                        key={bd.key}
                        style={{ height: `${heightPct}%`, backgroundColor: bd.color }}
                        className="w-full transition-all hover:opacity-80 relative group"
                        title={`${bd.label}: ${formatKSh(bd.amount)}`}
                      />
                    );
                  })}
                </div>
                <div className="text-xs text-neutral-500">{month.month}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-neutral-800">
            {sourceConfig.map((src) => (
              <div key={src.key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: src.color }} />
                <span className="text-xs text-neutral-400">{src.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth indicator */}
        {monthlyTotals.length >= 2 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Growth Analysis
            </h3>
            {(() => {
              const first = monthlyTotals[0].total;
              const last = monthlyTotals[monthlyTotals.length - 1].total;
              const growth = ((last - first) / first) * 100;
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-neutral-400">Starting Month</p>
                    <p className="text-xl font-bold mt-1">{formatKSh(first)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Latest Month</p>
                    <p className="text-xl font-bold mt-1">{formatKSh(last)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Growth Rate</p>
                    <p className={`text-xl font-bold mt-1 ${growth >= 0 ? 'text-green-500' : 'text-primary-500'}`}>
                      {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>
    </div>
  );
}
