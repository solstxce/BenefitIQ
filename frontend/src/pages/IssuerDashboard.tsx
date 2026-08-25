import React, { useState, useEffect } from 'react';
import { IssuerAnalyticsData } from '../types';
import { fetchIssuerAnalytics } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  Target,
  Percent,
  DollarSign,
  AlertTriangle,
  Users,
  Lightbulb,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const IssuerDashboard: React.FC = () => {
  const [data, setData] = useState<IssuerAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchIssuerAnalytics();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch issuer analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Aggregating portfolio intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="font-bold">Error loading issuer dashboard</h3>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const COLORS = ['#2563eb', '#6366f1', '#a855f7', '#10b981'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Benefit Intelligence Center</h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] uppercase font-mono">
              Issuer Analytics
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise overview of portfolio entitlement utilization, unrealized value exposure, and campaign uplift.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white text-xs font-mono">
            Simulated Enterprise Scale: 100k Members
          </Badge>
        </div>
      </div>

      {/* 1. Core KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Utilization Rate */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Utilization Rate</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {data.utilization_rate.toFixed(1)}%
              </span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +3.4%
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">Percentage of total eligible benefits activated</p>
          </CardContent>
        </Card>

        {/* Recovery Rate */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recovery Rate</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600">
                {data.recovery_rate.toFixed(1)}%
              </span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +12.1%
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">Unused value recovered through BenefitIQ nudges</p>
          </CardContent>
        </Card>

        {/* Recommendation Conversion */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nudge Conversion</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {data.recommendation_conversion.toFixed(1)}%
              </span>
              <span className="text-xs font-medium text-purple-600 flex items-center">
                <Sparkles className="h-3 w-3 mr-0.5" /> High Uplift
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">Nudges resulting in verified redemptions</p>
          </CardContent>
        </Card>

        {/* Benefit ROI */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Benefit ROI</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {data.benefit_roi.toFixed(0)}%
              </span>
              <span className="text-xs font-medium text-slate-500">Simulated</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">Value delivered vs. operational investment</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Charts Section: Benefit Utilization & Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization by Benefit Type */}
        <Card className="border-slate-200 bg-white">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-bold">Benefit Utilization Breakdown</CardTitle>
            <span className="text-xs text-slate-500">Activation percentage across card product benefits</span>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.benefit_utilization} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Utilization']}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                    {data.benefit_utilization.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Campaign / Nudge Performance */}
        <Card className="border-slate-200 bg-white">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-bold">Nudge Campaign Conversion</CardTitle>
            <span className="text-xs text-slate-500">Redemption conversion rates by engagement trigger</span>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-4">
            {data.campaign_performance.map((c, i) => (
              <div key={i} className="space-y-1.5 rounded-lg bg-slate-50 p-3 border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-900">{c.campaign}</span>
                  <span className="font-bold text-blue-600">{c.conversion.toFixed(1)}% Conversion</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, c.conversion)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. Underutilized Benefits Opportunities & Behavioral Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Underutilized Benefits Table */}
        <Card className="border-slate-200 bg-white lg:col-span-2">
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base font-bold">High-Priority Underutilized Benefits</CardTitle>
            </div>
            <span className="text-xs text-slate-500">Benefits with highest unrealized dollar value requiring targeted nudges</span>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-2.5">Benefit</th>
                    <th className="py-2.5">Utilization</th>
                    <th className="py-2.5">Priority</th>
                    <th className="py-2.5 text-right">Unrealized Value (Scaled)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.underutilized_benefits.length > 0 ? (
                    data.underutilized_benefits.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 font-semibold text-slate-900">{u.name}</td>
                        <td className="py-3 text-slate-600">{u.utilization.toFixed(0)}%</td>
                        <td className="py-3">
                          <Badge variant={u.priority === 'High' ? 'destructive' : 'warning'}>
                            {u.priority}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-slate-900">
                          ${u.unrealized_value.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500">
                        No critical underutilization detected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Behavioral Segments Overview */}
        <Card className="border-slate-200 bg-white">
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-base font-bold">Member Segments</CardTitle>
            </div>
            <span className="text-xs text-slate-500">Distribution by benefit activity</span>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-900">Highly Engaged</span>
                <Badge variant="success">34%</Badge>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                Maximizing perk value. System maintains restraint against spam.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 border border-amber-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-900">Needs Attention</span>
                <Badge variant="warning">48%</Badge>
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                High spending but leaving credits untouched. Target of proactive nudges.
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 p-3 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Inactive / Discovery</span>
                <Badge variant="secondary">18%</Badge>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Zero redemptions. Target for educational onboarding sequences.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 4. Recommended Business Actions */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white">
        <CardHeader className="p-6 pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-bold">Recommended Issuer Actions</CardTitle>
          </div>
          <span className="text-xs text-slate-500">Automated intelligence insights to boost overall portfolio ROI</span>
        </CardHeader>
        <CardContent className="p-6 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white p-4 border border-blue-100 shadow-2xs">
              <span className="text-xs font-bold text-blue-900">1. Boost Streaming Awareness</span>
              <p className="text-[11px] text-slate-600 mt-1">
                42% of digital subscribers have not activated their $20 credit. Trigger in-app partner banners.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-blue-100 shadow-2xs">
              <span className="text-xs font-bold text-blue-900">2. Travel Timing Nudges</span>
              <p className="text-[11px] text-slate-600 mt-1">
                Deploy airport lounge reminders within 48h of airline ticket transactions to capture high intent.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-blue-100 shadow-2xs">
              <span className="text-xs font-bold text-blue-900">3. End-of-Month Dining Push</span>
              <p className="text-[11px] text-slate-600 mt-1">
                Nudge dining cardholders 5 days prior to monthly credit expiration to drive restaurant spend.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-blue-100 shadow-2xs">
              <span className="text-xs font-bold text-blue-900">4. Retention Opportunity</span>
              <p className="text-[11px] text-slate-600 mt-1">
                Cardholders with &gt;$300 unrealized value exhibit 2x churn risk at annual renewal. Prioritize outreach.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

