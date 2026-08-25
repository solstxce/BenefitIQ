import React, { useState } from 'react';
import { Sparkles, Utensils, Plane, Tv, ShieldCheck, CheckCircle2, ArrowRight, Zap, Info, Clock } from 'lucide-react';
import { Recommendation } from '../types';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface NudgeBannerProps {
  recommendations: Recommendation[];
  onRedeem: (benefitId: number) => Promise<void>;
}

export const NudgeBanner: React.FC<NudgeBannerProps> = ({
  recommendations,
  onRedeem,
}) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [redeemedId, setRedeemedId] = useState<number | null>(null);

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">All Perks Fully Utilized</h4>
            <p className="text-sm text-slate-600">
              Great job! You've extracted the available value for your current cycle. We will notify you when new credits reset.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const topNudge = recommendations[0];
  const otherNudges = recommendations.slice(1, 3);

  const handleRedeemClick = async (benefitId: number) => {
    setLoadingId(benefitId);
    try {
      await onRedeem(benefitId);
      setRedeemedId(benefitId);
      setTimeout(() => setRedeemedId(null), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.toLowerCase().includes('dining')) return <Utensils className="h-5 w-5 text-amber-500" />;
    if (name.toLowerCase().includes('lounge') || name.toLowerCase().includes('travel')) return <Plane className="h-5 w-5 text-blue-500" />;
    if (name.toLowerCase().includes('streaming')) return <Tv className="h-5 w-5 text-purple-500" />;
    return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h3 className="font-bold text-lg text-slate-900">Personalized Engagement Nudges</h3>
        </div>
        <Badge variant="purple" className="text-xs font-semibold">
          AI Opportunity Engine Active
        </Badge>
      </div>

      {/* Hero Top Recommendation */}
      <Card className="border-blue-300 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200">
                  {getCategoryIcon(topNudge.benefit_name)}
                </span>
                <span className="font-bold text-base text-slate-900">{topNudge.benefit_name}</span>
                <Badge variant="default" className="bg-blue-600 text-white border-none font-bold">
                  Score: {Math.round(topNudge.opportunity_score)} / 100
                </Badge>
                <Badge variant="amber" className="text-[11px]">
                  Highest Priority
                </Badge>
              </div>

              {/* Explainability Section */}
              <div className="rounded-lg bg-white/80 p-3.5 border border-blue-200/60 shadow-2xs">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">Why this is recommended:</span>
                    <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                      {topNudge.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Button
                variant="accent"
                size="lg"
                disabled={loadingId === topNudge.benefit_id}
                onClick={() => handleRedeemClick(topNudge.benefit_id)}
                className="w-full md:w-auto"
              >
                {loadingId === topNudge.benefit_id ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Simulating Redemption...
                  </span>
                ) : redeemedId === topNudge.benefit_id ? (
                  <span className="flex items-center gap-2 text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Benefit Redeemed!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {topNudge.action_type === 'Use Benefit' ? 'Simulate Redemption' : 'Claim Benefit'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Secondary Recommendations */}
      {otherNudges.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {otherNudges.map((nudge) => (
            <div
              key={nudge.benefit_id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 shrink-0">
                  {getCategoryIcon(nudge.benefit_name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-xs text-slate-900">{nudge.benefit_name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Score: {Math.round(nudge.opportunity_score)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{nudge.explanation}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={loadingId === nudge.benefit_id}
                onClick={() => handleRedeemClick(nudge.benefit_id)}
                className="text-xs shrink-0"
              >
                {loadingId === nudge.benefit_id ? '...' : 'Redeem'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

