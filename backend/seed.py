from database import engine, SessionLocal, Base
import models
from datetime import datetime, timedelta, timezone

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(models.Customer).first():
        print("Data already seeded.")
        return

    # Benefits
    b1 = models.Benefit(name="Dining Credit", category="Dining", max_value=50.0, type="credit", frequency="monthly")
    b2 = models.Benefit(name="Airport Lounge Access", category="Travel", max_value=4.0, type="visit", frequency="annual")
    b3 = models.Benefit(name="Streaming Credit", category="Streaming", max_value=20.0, type="credit", frequency="monthly")
    b4 = models.Benefit(name="Purchase Protection", category="Protection", max_value=500.0, type="protection", frequency="per_purchase")
    db.add_all([b1, b2, b3, b4])
    db.commit()

    # Customers
    c1 = models.Customer(name="Alice (Frequent Traveler)", segment="Frequent Traveler")
    c2 = models.Customer(name="Bob (Dining Heavy)", segment="Dining Heavy")
    c3 = models.Customer(name="Charlie (Low Engagement)", segment="Low Engagement")
    c4 = models.Customer(name="Diana (Highly Engaged)", segment="Highly Engaged")
    db.add_all([c1, c2, c3, c4])
    db.commit()

    # Customer Benefits
    now = datetime.now(timezone.utc)
    next_month = now + timedelta(days=30)
    end_of_year = datetime(now.year, 12, 31, tzinfo=timezone.utc)

    # Alice: Travel focused, has used 1 lounge visit
    db.add(models.CustomerBenefit(customer_id=c1.id, benefit_id=b2.id, used_amount=1.0, expiry=end_of_year))
    db.add(models.CustomerBenefit(customer_id=c1.id, benefit_id=b1.id, used_amount=0.0, expiry=next_month))
    
    # Bob: Dining focused, unused dining credit
    db.add(models.CustomerBenefit(customer_id=c2.id, benefit_id=b1.id, used_amount=10.0, expiry=now + timedelta(days=5)))
    db.add(models.CustomerBenefit(customer_id=c2.id, benefit_id=b2.id, used_amount=0.0, expiry=end_of_year))
    db.add(models.CustomerBenefit(customer_id=c2.id, benefit_id=b3.id, used_amount=0.0, expiry=next_month))
    db.add(models.CustomerBenefit(customer_id=c2.id, benefit_id=b4.id, used_amount=0.0, expiry=end_of_year))

    # Charlie: Low engagement, nothing used
    for b in [b1, b2, b3, b4]:
        db.add(models.CustomerBenefit(customer_id=c3.id, benefit_id=b.id, used_amount=0.0, expiry=next_month if b.type == 'credit' else end_of_year))

    # Diana: Highly engaged, everything used
    db.add(models.CustomerBenefit(customer_id=c4.id, benefit_id=b1.id, used_amount=50.0, expiry=next_month))
    db.add(models.CustomerBenefit(customer_id=c4.id, benefit_id=b2.id, used_amount=4.0, expiry=end_of_year))
    db.add(models.CustomerBenefit(customer_id=c4.id, benefit_id=b3.id, used_amount=20.0, expiry=next_month))
    db.commit()

    # Transactions
    # Alice: Travel spend
    db.add(models.Transaction(customer_id=c1.id, amount=450.0, merchant="Delta Airlines", mcc_category="Airlines"))
    
    # Bob: Dining spend
    db.add(models.Transaction(customer_id=c2.id, amount=120.0, merchant="Steakhouse", mcc_category="Restaurants"))
    
    # Charlie: Random spend
    db.add(models.Transaction(customer_id=c3.id, amount=40.0, merchant="Grocery Store", mcc_category="Groceries"))

    # Diana: Everything
    db.add(models.Transaction(customer_id=c4.id, amount=15.0, merchant="Netflix", mcc_category="Streaming"))
    db.add(models.Transaction(customer_id=c4.id, amount=85.0, merchant="Cafe", mcc_category="Restaurants"))
    
    db.commit()

    # Initial Nudge Events (Historical)
    db.add(models.NudgeEvent(customer_id=c4.id, benefit_id=b1.id, redeemed=True, value_recovered=50.0))
    db.add(models.NudgeEvent(customer_id=c4.id, benefit_id=b3.id, redeemed=True, value_recovered=20.0))
    db.add(models.NudgeEvent(customer_id=c1.id, benefit_id=b2.id, redeemed=True, value_recovered=50.0))
    db.commit()
    
    print("Seed data inserted successfully.")

if __name__ == "__main__":
    seed_data()
