import { Customer, CustomerDashboardData, IssuerAnalyticsData } from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/customers`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function fetchCustomerDashboard(customerId: number): Promise<CustomerDashboardData> {
  const res = await fetch(`${API_BASE}/customers/${customerId}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch customer dashboard');
  return res.json();
}

export async function redeemBenefit(customerId: number, benefitId: number): Promise<{ status: string; recovered: number }> {
  const res = await fetch(`${API_BASE}/benefits/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: customerId, benefit_id: benefitId }),
  });
  if (!res.ok) throw new Error('Failed to redeem benefit');
  return res.json();
}

export async function fetchIssuerAnalytics(): Promise<IssuerAnalyticsData> {
  const res = await fetch(`${API_BASE}/issuer/analytics`);
  if (!res.ok) throw new Error('Failed to fetch issuer analytics');
  return res.json();
}

