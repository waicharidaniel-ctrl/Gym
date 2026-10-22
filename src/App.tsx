import { useState, useEffect } from 'react';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import MembershipPage from '@/pages/MembershipPage';
import SupplementsPage from '@/pages/SupplementsPage';
import ProgramsPage from '@/pages/ProgramsPage';
import ProgressPage from '@/pages/ProgressPage';
import RevenuePage from '@/pages/RevenuePage';
import ContactPage from '@/pages/ContactPage';
import CartPage from '@/pages/CartPage';
import PaymentPage from '@/pages/PaymentPage';
import DashboardPage from '@/pages/DashboardPage';

function AppContent() {
  const [page, setPage] = useState('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleNavigate = (target: string) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateWithPlan = (target: string, planId?: string) => {
    if (planId) setSelectedPlanId(planId);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'membership':
        return <MembershipPage onNavigate={handleNavigateWithPlan} />;
      case 'supplements':
        return <SupplementsPage onNavigate={handleNavigate} />;
      case 'programs':
        return <ProgramsPage onNavigate={handleNavigate} />;
      case 'progress':
        return <ProgressPage onNavigate={handleNavigate} />;
      case 'revenue':
        return <RevenuePage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'payment':
        return <PaymentPage onNavigate={handleNavigate} selectedPlanId={selectedPlanId} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const showFooter = page !== 'auth';

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Navbar currentPage={page} onNavigate={handleNavigate} />
      <main className="flex-1">{renderPage()}</main>
      {showFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
