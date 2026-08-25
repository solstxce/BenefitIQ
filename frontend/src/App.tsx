import React, { useState, useEffect } from 'react';
import { Customer } from './types';
import { fetchCustomers } from './services/api';
import { Navbar } from './components/Navbar';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { IssuerDashboard } from './pages/IssuerDashboard';
import { Sparkles, Layers, Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'customer' | 'issuer'>('customer');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(2); // Default to Bob (Dining Heavy) for primary demo story
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadCustomers = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetchCustomers();
      setCustomers(res);
      if (res.length > 0 && !res.some(c => c.id === selectedCustomerId)) {
        setSelectedCustomerId(res[0].id);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top sticky navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        onCustomerSelect={setSelectedCustomerId}
        onRefresh={loadCustomers}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {currentView === 'customer' ? (
          <CustomerDashboard
            customerId={selectedCustomerId}
            customers={customers}
            onSelectCustomer={setSelectedCustomerId}
          />
        ) : (
          <IssuerDashboard />
        )}
      </main>

      {/* Modern Footer with Architecture Cycle Reminder */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">BenefitIQ</span>
            <span>—</span>
            <span>Continuous Benefit Intelligence & Underutilization Analytics</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-600 border border-slate-200">
              IDENTIFY → QUANTIFY → ENGAGE → MEASURE → LEARN
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

