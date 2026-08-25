import React from 'react';
import { Sparkles, ShieldCheck, Building2, User, RefreshCw, ChevronRight } from 'lucide-react';
import { Customer } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface NavbarProps {
  currentView: 'customer' | 'issuer';
  onViewChange: (view: 'customer' | 'issuer') => void;
  customers: Customer[];
  selectedCustomerId: number;
  onCustomerSelect: (id: number) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  customers,
  selectedCustomerId,
  onCustomerSelect,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white font-bold text-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">Benefit<span className="text-blue-600">IQ</span></span>
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 uppercase tracking-widest">Prototype</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Continuous Benefit Intelligence Platform</p>
            </div>
          </div>

          {/* Intelligence Lifecycle Chip */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            <span className="text-blue-600 font-semibold">IDENTIFY</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-indigo-600 font-semibold">QUANTIFY</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-purple-600 font-semibold">ENGAGE</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-emerald-600 font-semibold">MEASURE</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-amber-600 font-semibold">LEARN</span>
          </div>
        </div>

        {/* View Switcher & Persona Selector */}
        <div className="flex items-center gap-3">
          {/* Customer Persona Selector (Visible in Customer View) */}
          {currentView === 'customer' && customers.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium pl-2 hidden md:inline">Demo Persona:</span>
              <select
                value={selectedCustomerId}
                onChange={(e) => onCustomerSelect(Number(e.target.value))}
                className="bg-white text-slate-800 font-medium rounded-md px-2.5 py-1 text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-sm"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Refresh Action */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            title="Refresh Intelligence State"
            className="text-slate-500 hover:text-slate-900"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </Button>

          {/* Dual-Sided Mode Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => onViewChange('customer')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentView === 'customer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Card Member
            </button>
            <button
              onClick={() => onViewChange('issuer')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentView === 'issuer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Card Issuer
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

