import { useState } from 'react';
import { Dumbbell, Menu, X, User as UserIcon, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navLinks = [
  { key: 'home', label: 'Home' },
  { key: 'membership', label: 'Membership' },
  { key: 'supplements', label: 'Supplements' },
  { key: 'programs', label: 'Programs' },
  { key: 'progress', label: 'Progress' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'contact', label: 'Contact' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">IRON<span className="text-primary-500">CORE</span></span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNav(link.key)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === link.key
                    ? 'text-primary-500 bg-primary-500/10'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav('cart')}
              className="relative p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="max-w-24 truncate">{profile?.full_name ?? 'Account'}</span>
                </button>
                <button
                  onClick={signOut}
                  className="p-2 text-neutral-400 hover:text-primary-500 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('auth')}
                className="hidden sm:flex px-4 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-800/50 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNav(link.key)}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === link.key
                    ? 'text-primary-500 bg-primary-500/10'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-neutral-800/50">
              {user ? (
                <>
                  <button onClick={() => handleNav('dashboard')} className="block w-full text-left px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white">
                    Dashboard
                  </button>
                  <button onClick={signOut} className="block w-full text-left px-3 py-2 text-sm font-medium text-primary-500 hover:text-primary-400">
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => handleNav('auth')} className="block w-full text-left px-3 py-2 text-sm font-semibold text-primary-500">
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
