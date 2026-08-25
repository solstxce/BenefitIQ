import models
import schemas
from datetime import datetime

def calculate_customer_benefit_value(cb: models.CustomerBenefit):
    remaining_value = 0.0
    estimated_value = 0.0
    
    if cb.benefit.type == "credit":
        remaining_value = max(0.0, cb.benefit.max_value - cb.used_amount)
        estimated_value = remaining_value
    elif cb.benefit.type == "visit":
        visits_remaining = max(0, cb.benefit.max_value - cb.used_amount)
        estimated_value = visits_remaining * 50.0  # Estimated $50 per visit
        remaining_value = estimated_value
    elif cb.benefit.type == "protection":
        estimated_value = cb.benefit.max_value
        remaining_value = estimated_value

    return remaining_value, estimated_value

def generate_recommendations(customer: models.Customer, customer_benefits: list[models.CustomerBenefit], transactions: list[models.Transaction]):
    recommendations = []
    
    # Analyze recent transactions for signals
    mcc_counts = {}
    for t in transactions:
        mcc_counts[t.mcc_category] = mcc_counts.get(t.mcc_category, 0) + 1

    for cb in customer_benefits:
        remaining_value, _ = calculate_customer_benefit_value(cb)
        if remaining_value <= 0:
            continue
            
        score = 0
        explanation = ""
        action_type = "View Benefit"
        
        # Base score on remaining value
        score += min(50, remaining_value / 5)

        # Boost score based on recent spending
        if cb.benefit.category == "Dining" and mcc_counts.get("Restaurants", 0) > 0:
            score += 30
            action_type = "Use Benefit"
            explanation = f"Recommended because you have ${remaining_value:.0f} remaining, recently spent at eligible restaurants, and the benefit resets soon."
        elif cb.benefit.category == "Travel" and (mcc_counts.get("Airlines", 0) > 0 or mcc_counts.get("Hotels", 0) > 0):
            score += 30
            action_type = "Use Benefit"
            explanation = "Your recent travel activity suggests you may be able to use this benefit on your next trip."
        elif cb.benefit.category == "Streaming":
            if mcc_counts.get("Streaming", 0) == 0:
                score += 20
                explanation = "You have unused streaming credit this month. Consider adding an eligible subscription."
        elif cb.benefit.category == "Protection":
            score += 10
            explanation = "You have eligible purchase protection available for your recent purchases."

        if score > 0:
            if not explanation:
                explanation = f"You have unused value for {cb.benefit.name}."
            recommendations.append(schemas.RecommendationOut(
                benefit_id=cb.benefit.id,
                benefit_name=cb.benefit.name,
                opportunity_score=score,
                explanation=explanation,
                action_type=action_type
            ))
            
    # Sort by score descending
    recommendations.sort(key=lambda x: x.opportunity_score, reverse=True)
    return recommendations

