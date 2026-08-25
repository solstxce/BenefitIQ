export interface Customer {
  id: number;
  name: string;
  segment: string;
}

export interface Benefit {
  id: number;
  name: string;
  category: 'Dining' | 'Travel' | 'Streaming' | 'Protection' | string;
  max_value: number;
  type: 'credit' | 'visit' | 'protection' | string;
  frequency: 'monthly' | 'annual' | 'per_purchase' | string;
}

export interface CustomerBenefit {
  id: number;
  used_amount: number;
  expiry: string;
  remaining_value: number;
  estimated_value: number;
  benefit: Benefit;
}

export interface Recommendation {
  benefit_id: number;
  benefit_name: string;
  opportunity_score: number;
  explanation: string;
  action_type: string;
}

export interface CustomerDashboardData {
  customer_id: number;
  name: string;
  benefit_health_score: number;
  unrealized_value: number;
  recovered_value: number;
  benefits: CustomerBenefit[];
  recommendations: Recommendation[];
}

export interface BenefitUtilizationItem {
  name: string;
  rate: number;
}

export interface UnderutilizedBenefitItem {
  name: string;
  utilization: number;
  priority: 'High' | 'Medium' | 'Low';
  unrealized_value: number;
}

export interface CampaignPerformanceItem {
  campaign: string;
  conversion: number;
}

export interface IssuerAnalyticsData {
  utilization_rate: number;
  recovery_rate: number;
  recommendation_conversion: number;
  benefit_roi: number;
  benefit_utilization: BenefitUtilizationItem[];
  underutilized_benefits: UnderutilizedBenefitItem[];
  campaign_performance: CampaignPerformanceItem[];
}

