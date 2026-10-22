import { useEffect, useState, FormEvent } from 'react';
import { Loader2, TrendingUp, TrendingDown, Plus, Trash2, Calendar, Activity, Scale, Ruler } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { ProgressEntry } from '@/types';

interface ProgressPageProps {
  onNavigate: (page: string) => void;
}

export default function ProgressPage({ onNavigate }: ProgressPageProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [notes, setNotes] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('progress_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('workout_date', { ascending: true });
    setEntries((data || []) as ProgressEntry[]);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const weekNumber = entries.length > 0
      ? Math.max(...entries.map((en) => en.week_number)) + 1
      : 1;

    const { error } = await supabase.from('progress_entries').insert({
      user_id: user.id,
      weight_kg: weight ? parseFloat(weight) : null,
      body_fat_pct: bodyFat ? parseFloat(bodyFat) : null,
      muscle_mass_kg: muscleMass ? parseFloat(muscleMass) : null,
      workout_date: workoutDate,
      notes,
      week_number: weekNumber,
    });

    if (!error) {
      setShowForm(false);
      setWeight('');
      setBodyFat('');
      setMuscleMass('');
      setNotes('');
      await loadEntries();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('progress_entries').delete().eq('id', id);
    if (!error) {
      setEntries(entries.filter((en) => en.id !== id));
    }
  };

  if (!user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Activity className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Track Your Progress</h2>
          <p className="text-neutral-400 mb-6">Sign in to log your workouts, monitor your gains, and see your transformation over time.</p>
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

  const latest = entries[entries.length - 1];
  const first = entries[0];
  const weightChange = latest?.weight_kg && first?.weight_kg ? latest.weight_kg - first.weight_kg : 0;
  const bodyFatChange = latest?.body_fat_pct && first?.body_fat_pct ? latest.body_fat_pct - first.body_fat_pct : 0;
  const muscleChange = latest?.muscle_mass_kg && first?.muscle_mass_kg ? latest.muscle_mass_kg - first.muscle_mass_kg : 0;

  const maxWeight = Math.max(...entries.map((e) => e.weight_kg || 0), 1);
  const chartHeight = 200;

  return (
    <div className="pt-16">
      <section className="py-12 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-3">
                <Activity className="w-4 h-4 text-primary-500" />
                <span className="text-sm text-primary-400 font-medium">Progress Tracker</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Your Fitness Journey</h1>
              <p className="text-neutral-400 mt-2">Log your checkups and track your transformation week by week.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log Progress Checkup
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 animate-slide-up">
            <h3 className="text-lg font-semibold mb-4">New Progress Checkup</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="75.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Body Fat (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="18.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Muscle Mass (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={muscleMass}
                  onChange={(e) => setMuscleMass(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="35.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Workout Date</label>
                <input
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Felt strong today, increased squat weight..."
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Checkup
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats overview */}
        {entries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                icon={Scale}
                label="Weight"
                value={latest?.weight_kg ? `${latest.weight_kg} kg` : '—'}
                change={weightChange}
                changeLabel="kg since start"
              />
              <StatCard
                icon={Ruler}
                label="Body Fat"
                value={latest?.body_fat_pct ? `${latest.body_fat_pct}%` : '—'}
                change={bodyFatChange}
                changeLabel="% since start"
                invertChange
              />
              <StatCard
                icon={Activity}
                label="Muscle Mass"
                value={latest?.muscle_mass_kg ? `${latest.muscle_mass_kg} kg` : '—'}
                change={muscleChange}
                changeLabel="kg since start"
              />
            </div>

            {/* Chart */}
            {entries.length >= 2 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Weight Progress Over Time
                </h3>
                <div className="relative" style={{ height: chartHeight + 40 }}>
                  <svg className="w-full" height={chartHeight + 40} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(239 68 68)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="rgb(239 68 68)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const points = entries.filter((e) => e.weight_kg).map((e) => e.weight_kg!);
                      if (points.length < 2) return null;
                      const minW = Math.min(...points);
                      const maxW = Math.max(...points);
                      const range = maxW - minW || 1;
                      const filtered = entries.filter((e) => e.weight_kg);
                      const stepX = 100 / (filtered.length - 1);
                      const pathPoints = filtered.map((e, i) => {
                        const x = i * stepX;
                        const y = chartHeight - ((e.weight_kg! - minW) / range) * (chartHeight - 20) - 10;
                        return { x, y, value: e.weight_kg!, week: e.week_number };
                      });
                      const linePath = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}`).join(' ');
                      const areaPath = `${linePath} L 100% ${chartHeight} L 0% ${chartHeight} Z`;
                      return (
                        <>
                          <path d={areaPath} fill="url(#weightGradient)" />
                          <path d={linePath} fill="none" stroke="rgb(239 68 68)" strokeWidth="2" />
                          {pathPoints.map((p, i) => (
                            <g key={i}>
                              <circle cx={`${p.x}%`} cy={p.y} r="4" fill="rgb(239 68 68)" />
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                  <div className="flex justify-between mt-2 text-xs text-neutral-500">
                    {entries.filter((e) => e.weight_kg).map((e, i) => (
                      <span key={i}>W{e.week_number}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  Checkup History
                </h3>
              </div>
              <div className="divide-y divide-neutral-800">
                {entries.slice().reverse().map((entry) => (
                  <div key={entry.id} className="p-4 hover:bg-neutral-800/30 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-500 font-bold text-sm">W{entry.week_number}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {new Date(entry.workout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-neutral-400 mt-0.5">
                          {entry.weight_kg && `${entry.weight_kg}kg`}
                          {entry.body_fat_pct && ` · ${entry.body_fat_pct}% BF`}
                          {entry.muscle_mass_kg && ` · ${entry.muscle_mass_kg}kg muscle`}
                        </p>
                        {entry.notes && <p className="text-xs text-neutral-500 mt-1 italic">{entry.notes}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-neutral-500 hover:text-primary-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Activity className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Progress Entries Yet</h3>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              Start logging your weight, body fat, and muscle mass to track your transformation over time.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log Your First Checkup
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  invertChange,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  invertChange?: boolean;
}) {
  const isPositive = invertChange ? change < 0 : change > 0;
  const isNeutral = change === 0;
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-primary-500" />
        <span className="text-sm text-neutral-400">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {!isNeutral && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-500' : 'text-primary-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{change > 0 ? '+' : ''}{change.toFixed(1)} {changeLabel}</span>
        </div>
      )}
    </div>
  );
}
