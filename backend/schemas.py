from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BenefitBase(BaseModel):
    name: str
    category: str
    max_value: float
    type: str
    frequency: str

class Benefit(BenefitBase):
    id: int
    class Config:
        orm_mode = True

class CustomerBenefitBase(BaseModel):
    used_amount: float
    expiry: datetime
    remaining_value: float
    estimated_value: float

class CustomerBenefitOut(CustomerBenefitBase):
    id: int
    benefit: Benefit
    class Config:
        orm_mode = True

class RecommendationOut(BaseModel):
    benefit_id: int
    benefit_name: str
    opportunity_score: float
    explanation: str
    action_type: str

class CustomerDashboardOut(BaseModel):
    customer_id: int
    name: str
    benefit_health_score: int
    unrealized_value: float
    recovered_value: float
    benefits: List[CustomerBenefitOut]
    recommendations: List[RecommendationOut]

class AnalyticsOut(BaseModel):
    utilization_rate: float
    recovery_rate: float
    recommendation_conversion: float
    benefit_roi: float
    benefit_utilization: List[dict]
    underutilized_benefits: List[dict]
    campaign_performance: List[dict]

class RedeemRequest(BaseModel):
    customer_id: int
    benefit_id: int

