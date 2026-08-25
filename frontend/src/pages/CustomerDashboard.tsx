import React, { useState, useEffect } from 'react';
import { CustomerDashboardData, Customer } from '../types';
import { fetchCustomerDashboard, redeemBenefit } from '../services/api';
import { HeroMetric } from '../components/HeroMetric';
import { NudgeBanner } from '../components/NudgeBanner';
import { BenefitCard } from '../components/BenefitCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Lightbulb, ShieldCheck, ArrowUpRight, HelpCircle } from 'lucide-react';

interface CustomerDashboardProps {
  customerId: number;
  customers: Customer[];
  onSelectCustomer: (id: number) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  customerId,
  customers,
  onSelectCustomer,
}) => {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchCustomerDashboard(customerId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load customer dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customerId]);

  const handleRedeem = async (benefitId: number) => {
    try {
      setRedeemingId(benefitId);
      await redeemBenefit(customerId, benefitId);
      // Reload dashboard immediately to sync state
      await loadData();
    } catch (err: any) {
      alert('Error redeeming benefit: ' + err.message);
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading benefit intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="font-bold">Error loading dashboard</h3>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Persona Quick Switcher Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">Switch Persona:</span>
        {customers.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCustomer(c.id)}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all whitespace-nowrap ${
              c.id === customerId
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 1. Hero Overview Metrics */}
      <HeroMetric
        unrealizedValue={data.unrealized_value}
        recoveredValue={data.recovered_value}
        healthScore={data.benefit_health_score}
        customerName={data.name}
      />

      {/* 2. Top Personalized Nudges / Recommendations */}
      <NudgeBanner
        recommendations={data.recommendations}
        onRedeem={handleRedeem}
      />

      {/* 3. Benefit Portfolio List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Your Benefit Entitlements</h3>
            <p className="text-xs text-slate-500">Live tracker of active perks, limits, and expiration windows.</p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {data.benefits.length} Total Enrolled Perks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.benefits.map((item) => (
            <BenefitCard
              key={item.id}
              item={item}
              onRedeem={handleRedeem}
              isRedeeming={redeemingId === item.benefit.id}
            />
          ))}
        </div>
      </div>

      {/* 4. Smart Benefit Tips & Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="p-5 pb-3 flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Smart Timing Tip</CardTitle>
              <span className="text-xs text-slate-500">Automated benefit schedule advisor</span>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed">
            Monthly credits (like Dining and Streaming) reset on the 1st of each month and do not roll over. Setting a recurring monthly reminder ensures zero wasted statement credit.
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="p-5 pb-3 flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Protection Coverage</CardTitle>
              <span className="text-xs text-slate-500">Automatic member insurance</span>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed">
            Eligible purchases made with your card qualify for complimentary 90-day damage and theft protection up to $500. No pre-enrollment required.
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

