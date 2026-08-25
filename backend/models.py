from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    segment = Column(String) # Frequent Traveler, Dining Heavy, etc.
    
    transactions = relationship("Transaction", back_populates="customer")
    customer_benefits = relationship("CustomerBenefit", back_populates="customer")

class Benefit(Base):
    __tablename__ = "benefits"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String) # Dining, Travel, Protection, Streaming
    max_value = Column(Float)
    type = Column(String) # credit, visit, protection
    frequency = Column(String) # monthly, annual, per_purchase

    customer_benefits = relationship("CustomerBenefit", back_populates="benefit")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    amount = Column(Float)
    merchant = Column(String)
    mcc_category = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="transactions")

class CustomerBenefit(Base):
    __tablename__ = "customer_benefits"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    benefit_id = Column(Integer, ForeignKey("benefits.id"))
    used_amount = Column(Float, default=0.0)
    expiry = Column(DateTime)
    
    customer = relationship("Customer", back_populates="customer_benefits")
    benefit = relationship("Benefit", back_populates="customer_benefits")

class NudgeEvent(Base):
    __tablename__ = "nudge_events"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    benefit_id = Column(Integer, ForeignKey("benefits.id"))
    recommended_at = Column(DateTime, default=datetime.datetime.utcnow)
    redeemed = Column(Boolean, default=False)
    value_recovered = Column(Float, default=0.0)

