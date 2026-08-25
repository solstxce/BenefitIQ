import React from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Progress } from './ui/Progress';
import { Badge } from './ui/Badge';

interface HeroMetricProps {
  unrealizedValue: number;
  recoveredValue: number;
  healthScore: number;
  customerName: string;
}

export const HeroMetric: React.FC<HeroMetricProps> = ({
  unrealizedValue,
  recoveredValue,
  healthScore,
  customerName,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {/* 1. Unrealized Benefit Value (Primary Problem Metric) */}
      <Card className="relative overflow-hidden border-blue-200 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white shadow-xl md:col-span-2">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                  <ShieldAlert className="mr-1 h-3 w-3 text-blue-300" />
                  Benefit Underutilization
                </Badge>
                <span className="text-xs text-slate-300">Welcome back, {customerName}</span>
              </div>
              
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                  ${unrealizedValue.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-blue-200">Unrealized Value</span>
              </div>

              <p className="mt-2 text-sm text-slate-300 max-w-lg leading-relaxed">
                Eligible credits, lounge visits, and protection coverage currently available on your membership that remain unused.
              </p>
            </div>

            {/* Value Recovered Pill */}
            <div className="flex flex-col items-start sm:items-end rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
              <span className="text-xs text-slate-300 font-medium">Value Recovered To Date</span>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-2xl font-bold text-emerald-300">
                  +${recoveredValue.toLocaleString()}
                </span>
              </div>
              <span className="text-[11px] text-slate-300 mt-1">Direct card savings realized</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Benefit Health Score Card */}
      <Card className="border-slate-200 bg-white shadow-sm flex flex-col justify-between">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Benefit Health</span>
            <Badge
              variant={healthScore >= 75 ? 'success' : healthScore >= 40 ? 'warning' : 'destructive'}
            >
              {healthScore >= 75 ? 'Optimal' : healthScore >= 40 ? 'Moderate' : 'Underutilized'}
            </Badge>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{healthScore}</span>
            <span className="text-sm text-slate-500">/ 100</span>
          </div>

          <div className="mt-3">
            <Progress
              value={healthScore}
              className="h-2 bg-slate-100"
              indicatorClassName={
                healthScore >= 75
                  ? 'bg-emerald-500'
                  : healthScore >= 40
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }
            />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
            <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Measures your membership value extraction efficiency. Higher score means fewer perks are wasted.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

