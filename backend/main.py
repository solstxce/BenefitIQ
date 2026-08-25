from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os

import models
import schemas
import engine
from database import get_db, engine as db_engine
from seed import seed_data

models.Base.metadata.create_all(bind=db_engine)
seed_data()

app = FastAPI(title="BenefitIQ Prototype")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For prototype demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/", include_in_schema=False)
def read_root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "BenefitIQ API is running. Access /docs for API schema."}

@app.get("/api/customers")
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer).all()
    return [{"id": c.id, "name": c.name, "segment": c.segment} for c in customers]

@app.get("/api/customers/{customer_id}/dashboard", response_model=schemas.CustomerDashboardOut)
def get_customer_dashboard(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    customer_benefits = db.query(models.CustomerBenefit).filter(models.CustomerBenefit.customer_id == customer_id).all()
    transactions = db.query(models.Transaction).filter(models.Transaction.customer_id == customer_id).all()
    
    unrealized_value = 0.0
    recovered_value = sum([n.value_recovered for n in db.query(models.NudgeEvent).filter(models.NudgeEvent.customer_id == customer_id, models.NudgeEvent.redeemed == True).all()])
    
    cb_outs = []
    for cb in customer_benefits:
        rem_val, est_val = engine.calculate_customer_benefit_value(cb)
        unrealized_value += rem_val
        cb_outs.append(schemas.CustomerBenefitOut(
            id=cb.id,
            used_amount=cb.used_amount,
            expiry=cb.expiry,
            remaining_value=rem_val,
            estimated_value=est_val,
            benefit=cb.benefit
        ))
        
    recommendations = engine.generate_recommendations(customer, customer_benefits, transactions)
    
    # Calculate a simple health score
    total_benefits = len(customer_benefits)
    used_benefits = sum(1 for cb in customer_benefits if cb.used_amount > 0)
    health_score = int((used_benefits / total_benefits) * 100) if total_benefits > 0 else 0
    # Boost health score a bit for demo purposes
    health_score = min(100, health_score + 20)
    
    return schemas.CustomerDashboardOut(
        customer_id=customer.id,
        name=customer.name,
        benefit_health_score=health_score,
        unrealized_value=unrealized_value,
        recovered_value=recovered_value,
        benefits=cb_outs,
        recommendations=recommendations
    )

@app.post("/api/benefits/redeem")
def redeem_benefit(req: schemas.RedeemRequest, db: Session = Depends(get_db)):
    cb = db.query(models.CustomerBenefit).filter(
        models.CustomerBenefit.customer_id == req.customer_id,
        models.CustomerBenefit.benefit_id == req.benefit_id
    ).first()
    
    if not cb:
        raise HTTPException(status_code=404, detail="Benefit not found for customer")
        
    rem_val, _ = engine.calculate_customer_benefit_value(cb)
    
    if cb.benefit.type == "credit":
        cb.used_amount = cb.benefit.max_value
    elif cb.benefit.type == "visit":
        cb.used_amount += 1
        rem_val = 50.0 # Standard visit value for recovery
        
    # Record nudge event
    nudge = models.NudgeEvent(
        customer_id=req.customer_id,
        benefit_id=req.benefit_id,
        redeemed=True,
        value_recovered=rem_val
    )
    db.add(nudge)
    db.commit()
    return {"status": "success", "recovered": rem_val}

@app.get("/api/issuer/analytics", response_model=schemas.AnalyticsOut)
def get_issuer_analytics(db: Session = Depends(get_db)):
    all_cbs = db.query(models.CustomerBenefit).all()
    nudges = db.query(models.NudgeEvent).all()
    
    total_benefits_count = len(all_cbs)
    used_benefits_count = sum(1 for cb in all_cbs if cb.used_amount > 0)
    utilization_rate = (used_benefits_count / total_benefits_count * 100) if total_benefits_count > 0 else 0
    
    total_unrealized = sum(engine.calculate_customer_benefit_value(cb)[0] for cb in all_cbs)
    total_recovered = sum(n.value_recovered for n in nudges if n.redeemed)
    
    recovery_rate = (total_recovered / (total_recovered + total_unrealized) * 100) if (total_recovered + total_unrealized) > 0 else 0
    
    total_nudges = len(nudges) + 10 # Adding some base fake nudges for demo
    redeemed_nudges = sum(1 for n in nudges if n.redeemed)
    conversion = (redeemed_nudges / total_nudges * 100) if total_nudges > 0 else 0
    
    # Benefit Utilization breakdown
    b_utils = []
    underutilized = []
    benefits = db.query(models.Benefit).all()
    for b in benefits:
        b_cbs = [cb for cb in all_cbs if cb.benefit_id == b.id]
        if not b_cbs: continue
        used = sum(1 for cb in b_cbs if cb.used_amount > 0)
        rate = (used / len(b_cbs)) * 100
        b_utils.append({"name": b.name, "rate": rate})
        
        if rate < 50:
            unreal_val = sum(engine.calculate_customer_benefit_value(cb)[0] for cb in b_cbs)
            underutilized.append({
                "name": b.name,
                "utilization": rate,
                "priority": "High" if unreal_val > 100 else "Medium",
                "unrealized_value": unreal_val * 1000 # scale for demo
            })
            
    campaign_perf = [
        {"campaign": "Dining Reminder", "conversion": 46.0 + conversion / 5},
        {"campaign": "Lounge Awareness", "conversion": 29.0 + conversion / 5},
        {"campaign": "Travel Nudge", "conversion": 52.0 + conversion / 5}
    ]
    
    return schemas.AnalyticsOut(
        utilization_rate=utilization_rate,
        recovery_rate=recovery_rate,
        recommendation_conversion=conversion,
        benefit_roi=145.0, # Fake 145% ROI for demo
        benefit_utilization=b_utils,
        underutilized_benefits=underutilized,
        campaign_performance=campaign_perf
    )

