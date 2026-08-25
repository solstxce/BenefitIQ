import React from 'react';
import { Utensils, Plane, Tv, ShieldCheck, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { CustomerBenefit } from '../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Progress } from './ui/Progress';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface BenefitCardProps {
  item: CustomerBenefit;
  onRedeem: (benefitId: number) => void;
  isRedeeming: boolean;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({ item, onRedeem, isRedeeming }) => {
  const { benefit, used_amount, remaining_value, expiry } = item;
  const isFullyUsed = remaining_value <= 0;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dining':
        return <Utensils className="h-5 w-5 text-amber-500" />;
      case 'travel':
        return <Plane className="h-5 w-5 text-blue-500" />;
      case 'streaming':
        return <Tv className="h-5 w-5 text-purple-500" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getFormatLabel = () => {
    if (benefit.type === 'visit') {
      const unusedVisits = Math.max(0, benefit.max_value - used_amount);
      return `${unusedVisits} of ${benefit.max_value} visits remaining`;
    }
    if (benefit.type === 'protection') {
      return `Up to $${benefit.max_value} coverage`;
    }
    return `$${used_amount.toFixed(0)} used of $${benefit.max_value.toFixed(0)} limit`;
  };

  // Format expiry
  const expiryDate = new Date(expiry);
  const now = new Date();
  const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays <= 7 && diffDays > 0;

  return (
    <Card className={`flex flex-col justify-between overflow-hidden border transition-all ${
      isFullyUsed
        ? 'border-slate-200 bg-slate-50/50 opacity-75'
        : isExpiringSoon
        ? 'border-amber-300 bg-white ring-1 ring-amber-200'
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}>
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
              {getCategoryIcon(benefit.category)}
            </div>
            <div>
              <CardTitle className="text-base font-bold">{benefit.name}</CardTitle>
              <span className="text-xs text-slate-500 font-medium capitalize">
                {benefit.category} • {benefit.frequency}
              </span>
            </div>
          </div>

          <Badge
            variant={
              isFullyUsed
                ? 'secondary'
                : isExpiringSoon
                ? 'warning'
                : 'default'
            }
          >
            {isFullyUsed ? 'Utilized' : isExpiringSoon ? `Resets in ${diffDays}d` : 'Active'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>{getFormatLabel()}</span>
            <span>{Math.round((used_amount / benefit.max_value) * 100)}%</span>
          </div>
          <Progress
            value={used_amount}
            max={benefit.max_value}
            indicatorClassName={
              isFullyUsed ? 'bg-slate-400' : isExpiringSoon ? 'bg-amber-500' : 'bg-blue-600'
            }
          />
        </div>

        {/* Value Details */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 border border-slate-100">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium uppercase tracking-wider">
              {benefit.type === 'protection' ? 'Eligible Protection' : benefit.type === 'visit' ? 'Estimated Value' : 'Unused Credit'}
            </span>
            <span className="text-lg font-bold text-slate-900">
              ${remaining_value.toFixed(0)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 block font-medium uppercase tracking-wider">
              Cycle End
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          variant={isFullyUsed ? 'outline' : 'default'}
          size="sm"
          className="w-full text-xs font-semibold"
          disabled={isFullyUsed || isRedeeming}
          onClick={() => onRedeem(benefit.id)}
        >
          {isFullyUsed ? (
            <span className="flex items-center gap-1.5 text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Benefit Fully Claimed
            </span>
          ) : (
            `Simulate Redemption ($${remaining_value.toFixed(0)})`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

