import { useEffect, useState } from 'react';
import { Loader2, Plus, ShoppingCart, Filter, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import type { Supplement } from '@/types';

interface SupplementsPageProps {
  onNavigate: (page: string) => void;
}

const supplementImages: Record<string, string> = {
  'Whey Protein Isolate': 'https://images.pexels.com/photos/36429468/pexels-photo-36429468.png?auto=compress&cs=tinysrgb&h=650&w=940',
  'Creatine Monohydrate': 'https://images.pexels.com/photos/6551143/pexels-photo-6551143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'BCAA Recovery': 'https://images.pexels.com/photos/15120889/pexels-photo-15120889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Pre-Workout Energy': 'https://images.pexels.com/photos/4378525/pexels-photo-4378525.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Mass Gainer': 'https://images.pexels.com/photos/36429463/pexels-photo-36429463.png?auto=compress&cs=tinysrgb&h=650&w=940',
  'Multivitamin Complex': 'https://images.pexels.com/photos/10915256/pexels-photo-10915256.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Omega-3 Fish Oil': 'https://images.pexels.com/photos/16216617/pexels-photo-16216617.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Fat Burner Pro': 'https://images.pexels.com/photos/36429456/pexels-photo-36429456.png?auto=compress&cs=tinysrgb&h=650&w=940',
};

const categoryColors: Record<string, string> = {
  Protein: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Performance: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
  Recovery: 'bg-green-500/15 text-green-400 border-green-500/30',
  Health: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  'Weight Loss': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

export default function SupplementsPage({ onNavigate }: SupplementsPageProps) {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('supplements')
        .select('*')
        .order('sort_order');
      setSupplements(data as Supplement[]);
      setLoading(false);
    };
    load();
  }, []);

  const categories = ['All', ...Array.from(new Set(supplements.map((s) => s.category)))];

  const filtered = category === 'All' ? supplements : supplements.filter((s) => s.category === category);

  const handleAdd = (supp: Supplement) => {
    addToCart(supp);
    setAddedId(supp.id);
    setTimeout(() => setAddedId(null), 1500);
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
      <section className="py-16 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-4">
            <Package className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-400 font-medium">Nutrition Supplements</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            Fuel Your <span className="text-primary-500">Performance</span>
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Premium quality supplements to support muscle growth, recovery, and overall health. All products are lab-tested and certified.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          <Filter className="w-5 h-5 text-neutral-500 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((supp, idx) => (
            <div
              key={supp.id}
              className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-primary-500/40 transition-all hover:translate-y-[-4px] animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-800">
                <img
                  src={supplementImages[supp.name] || 'https://images.pexels.com/photos/6551143/pexels-photo-6551143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'}
                  alt={supp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full border ${categoryColors[supp.category] || 'bg-neutral-700/80 text-neutral-300 border-neutral-600'}`}>
                  {supp.category}
                </span>
                {supp.stock < 10 && supp.stock > 0 && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full bg-accent-500/90 text-white">
                    Low Stock
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg leading-tight">{supp.name}</h3>
                <p className="text-sm text-neutral-400 mt-2 line-clamp-2 leading-relaxed">{supp.description}</p>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xl font-bold">KSh {supp.price.toLocaleString()}</span>
                    <p className="text-xs text-neutral-500 mt-0.5">{supp.stock} in stock</p>
                  </div>
                  <button
                    onClick={() => handleAdd(supp)}
                    disabled={supp.stock === 0}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      addedId === supp.id
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white hover:scale-105'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {addedId === supp.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('cart')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all hover:scale-[1.02]"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart & Checkout
          </button>
        </div>
      </section>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
