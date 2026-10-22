import { useState, FormEvent } from 'react';
import { Dumbbell, Mail, Lock, User, Phone, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        onNavigate('dashboard');
      }
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(email, password, fullName, phone);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        onNavigate('dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/17944268/pexels-photo-17944268.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920"
          alt="Gym background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-neutral-950/80" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 animate-scale-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Join IronCore'}
          </h2>
          <p className="text-sm text-neutral-400 text-center mb-6">
            {mode === 'signin' ? 'Sign in to access your membership and track progress' : 'Create your account and start your fitness journey'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-sm text-neutral-400 hover:text-primary-500 transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
