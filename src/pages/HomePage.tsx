import { Dumbbell, Heart, Zap, Trophy, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: '2,500+', label: 'Active Members' },
  { value: '50+', label: 'Weekly Classes' },
  { value: '30+', label: 'Expert Trainers' },
  { value: '15K', label: 'Sq Ft Facility' },
];

const features = [
  {
    icon: Dumbbell,
    title: 'State-of-the-Art Equipment',
    desc: 'Over 200 machines and free weights from premium brands, maintained to the highest standards.',
  },
  {
    icon: Heart,
    title: 'Personalized Nutrition',
    desc: 'Custom meal plans and premium supplements tailored to your fitness goals and dietary needs.',
  },
  {
    icon: Zap,
    title: 'Progressive Training',
    desc: 'Structured workout programs with weekly progression to keep you challenged and growing.',
  },
  {
    icon: Trophy,
    title: 'Track Your Gains',
    desc: 'Monitor your progress with our built-in tracker — weight, body fat, muscle mass, and more.',
  },
  {
    icon: Users,
    title: 'Expert Coaching',
    desc: 'Certified personal trainers ready to guide you from your first rep to your personal best.',
  },
  {
    icon: Clock,
    title: 'Open 18 Hours Daily',
    desc: 'Train on your schedule. We are open from 5 AM to 11 PM, Monday through Friday.',
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/37785329/pexels-photo-37785329.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920"
            alt="Gym workout"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm text-primary-400 font-medium">#1 Fitness Center in Nairobi</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-balance animate-slide-up delay-100">
              Forge Your<br />
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Best Self</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-300 leading-relaxed max-w-xl animate-slide-up delay-200">
              Join IronCore Gym and transform your body with world-class training, premium supplements, and a community that pushes you to be stronger every day.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
              <button
                onClick={() => onNavigate(user ? 'membership' : 'auth')}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-600/30 flex items-center justify-center gap-2 group"
              >
                {user ? 'View Membership Plans' : 'Get Started Today'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('programs')}
                className="px-8 py-4 bg-neutral-800/80 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-all border border-neutral-700"
              >
                Explore Programs
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 animate-fade-in delay-400">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-neutral-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">
              Everything You Need to <span className="text-primary-500">Succeed</span>
            </h2>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
              From your first day to your hundredth, we provide the tools, guidance, and motivation to keep you progressing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="group p-6 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-primary-500/40 transition-all hover:translate-y-[-4px]"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/40371840/pexels-photo-40371840.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Gym interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 to-neutral-950/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">
              Ready to Start Your <span className="text-primary-500">Transformation?</span>
            </h2>
            <p className="mt-4 text-neutral-300">
              Sign up today and get your first week free. No commitment, just results.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {['Free fitness assessment', 'Personalized workout plan', 'Access to all equipment', '1 group class session'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  {item}
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate(user ? 'membership' : 'auth')}
              className="mt-8 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] flex items-center gap-2 group"
            >
              Join IronCore Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
