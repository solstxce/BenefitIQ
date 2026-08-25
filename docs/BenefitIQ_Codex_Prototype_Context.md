# BenefitIQ — Codex Prototype Build Context

## Project Context

Build a working prototype called **BenefitIQ**.

BenefitIQ is a **dual-sided continuous benefit intelligence platform** for card issuers and card members.

The core problem is **Benefit Underutilization Analytics**: card issuers struggle to understand how much benefit value customers leave unused, while card members often do not know which benefits they are eligible for, how much value remains available, or when they should use those benefits.

The prototype must stay tightly aligned with this problem. Do not turn it into a generic banking dashboard, rewards app, coupon app, chatbot, or expense tracker.

The central product lifecycle is:

**IDENTIFY → QUANTIFY → ENGAGE → MEASURE → LEARN**

This lifecycle must be visible throughout the prototype.

---

## Problem Statement Requirements

The prototype must demonstrate:

1. Mapping each card member's transaction history to their benefit entitlements.
2. Calculating the dollar value of unclaimed benefits, including unused credits, lounge visits, and protection benefits.
3. A customer-facing interface that surfaces the most important unclaimed benefits in personalized terms.
4. Nudge logic that triggers targeted engagement at the right moment based on spending patterns.
5. Optimization through entitlement accuracy, nudge relevance, and measurable engagement uplift.

---

## Product Positioning

BenefitIQ is a **continuous benefit analytics and engagement platform**, not primarily an AI chatbot.

Use technology where it genuinely adds value:

- deterministic rules for eligibility
- deterministic calculations for benefit valuation
- analytics for measuring unrealized value
- machine learning for opportunity ranking and nudge personalization
- optional LLM only for natural-language explanations

Do not add AI everywhere just to claim AI usage.

---

## Two-Sided Product

### Card Member Experience

The user should be able to answer:

- What benefits do I have?
- Which benefits have I not used?
- How much value am I leaving unused?
- Which benefit should I use next?
- Why am I receiving this recommendation?
- How much value have I recovered?
- What benefits are expiring soon?

The experience should help users **maximize the value of their card membership**.

### Card Issuer Experience

The issuer should be able to answer:

- Which benefits are underutilized?
- How much customer value remains unclaimed?
- Which benefits have the largest opportunity?
- Which behavioral segments are underusing benefits?
- Which nudges/campaigns are effective?
- How much value is being recovered?
- What is the benefit ROI?
- What actions should the issuer take next?

The issuer experience should provide **actionable business intelligence**, not just charts.

---

## Core Intelligence Cycle

### 1. IDENTIFY

Determine the complete set of benefits a customer is eligible for.

Inputs:
- card product
- customer profile
- benefit catalog
- eligibility rules
- transaction history
- merchant category
- benefit usage history

Output: **Eligible Benefit Portfolio**

### 2. QUANTIFY

Determine how much benefit value remains unused.

Examples:
- remaining dining/statement credits
- remaining streaming credits
- unused lounge visits
- unused purchase protection opportunity
- unused travel protection opportunity

Output: **Unrealized Benefit Value ($)**

Example:

```text
Dining Credit          $40 unused
Lounge Access          $150 potential value
Streaming Credit       $60 unused
Purchase Protection    $100 eligible value

Total Unrealized Value = $350
```

Distinguish actual remaining credit from estimated or potential protection value.

### 3. ENGAGE

Determine which opportunity should be presented to the customer.

Consider:
- benefit value
- eligibility
- expiry
- recent spending
- merchant category
- customer behavior
- historical redemption
- predicted likelihood of redemption
- timing

Output: **Personalized Engagement Opportunity**

Example:

> You have $40 of dining credit remaining this month. Since you've recently spent at restaurants, this may be a good time to use it.

### 4. MEASURE

Track:
- recommendation shown
- recommendation clicked
- benefit redeemed
- value recovered
- campaign conversion
- utilization change
- customer engagement

Output: **Measured Outcome**

### 5. LEARN

Use historical outcomes to improve future recommendations:
- which recommendations get redeemed
- which timing works best
- which behaviors predict redemption
- which channels perform best
- which benefits are consistently ignored

Feedback loop:

```text
Recommendation
      ↓
Customer Action
      ↓
Benefit Redemption
      ↓
Outcome Measurement
      ↓
Learning
      ↓
Better Recommendation
```

---

## Prototype Architecture

```text
CARD ISSUER DATA
    |
    |-- Customer Profiles
    |-- Card Products
    |-- Transactions
    |-- Benefit Catalog
    |-- Merchant Data
    |-- Benefit Usage
    |-- Engagement History
    |
    v
BENEFIT INTELLIGENCE ENGINE
    |
    |-- Entitlement Mapping Engine
    |-- Benefit Valuation Engine
    |-- Opportunity Ranking Engine
    |-- Engagement/Nudge Engine
    |-- Measurement Engine
    |-- Learning Engine
    |
    +-----------------------+
    |                       |
    v                       v
CUSTOMER EXPERIENCE     ISSUER EXPERIENCE
    |                       |
Customer Dashboard      Issuer Analytics
Recommendations         Benefit Utilization
Benefit Insights        Underutilized Benefits
Smart Nudges            Campaign Analytics
Savings                 Benefit ROI
    |                       |
    +-----------+-----------+
                |
                v
         FEEDBACK / LEARNING
                |
                v
       BETTER RECOMMENDATIONS
```

---

## Technical Prototype Stack

Prefer a simple, maintainable implementation.

### Frontend
- React
- TypeScript
- Tailwind CSS
- Recharts or equivalent

### Backend
- Python
- FastAPI

Possible API areas:

```text
/api/customers
/api/cards
/api/benefits
/api/benefits/eligible
/api/benefits/unrealized-value
/api/recommendations
/api/nudges
/api/analytics
/api/issuer
```

### Data

Use seeded/mock data.

Use SQLite for simplicity, or PostgreSQL if already available.

Do not require proprietary banking/card APIs.

### Analytics
- pandas
- NumPy

### ML

Use XGBoost, Random Forest, or Gradient Boosting if enough meaningful data exists.

If training data is insufficient, use a deterministic scoring model behind an abstraction that can later be replaced by ML.

Do not fake an ML model.

---

## Benefit Catalog

Create a configurable benefit catalog with at least:

### Dining Credit
```text
Monthly limit: $50
Eligible MCCs: Restaurants
Frequency: Monthly
```

### Airport Lounge Access
```text
Visits: 4/year
Estimated value per visit: $50
```

### Streaming Credit
```text
Monthly limit: $20
Eligible merchants: Selected streaming providers
```

### Purchase Protection
```text
Coverage: Eligible purchases
Maximum coverage: $500
```

### Travel Protection
```text
Eligible when qualifying travel is purchased
Estimated benefit value based on coverage
```

Do not hard-code benefit rules throughout the application.

---

## Entitlement Mapping

Given:

```text
Customer
+
Card Product
+
Benefit Catalog
+
Transaction History
```

determine:

```text
Eligible Benefits
+
Used Amount
+
Remaining Amount
+
Expiry
+
Potential Value
```

Example customer activity:

```text
Restaurant spending
Airline spending
Streaming subscription
```

The system should map these signals to applicable benefits and calculate remaining value.

---

## Benefit Valuation

Make monetary value explicit.

For credit benefits:

```text
Benefit Value Remaining
=
Maximum Eligible Value
-
Value Already Used
```

For visit-based benefits:

```text
Unused Visits × Estimated Value Per Visit
```

For protection benefits, label values as:

**Potential/Eligible Protection Value**

Do not imply that a customer has already lost that exact cash amount.

Distinguish:
- actual remaining credit
- estimated value
- potential protection value

---

## Opportunity Ranking

Rank opportunities using signals such as:

```text
Benefit Value
+
Eligibility
+
Expiry Urgency
+
Recent Relevant Spending
+
Historical Redemption Behavior
+
Predicted Redemption Probability
```

Example:

```text
Dining Credit
Opportunity Score: 92

Lounge Access
Opportunity Score: 78

Streaming Credit
Opportunity Score: 61
```

Scores must be explainable.

Example explanation:

> Recommended because you have $40 remaining, recently spent at eligible restaurants, and the benefit resets in 5 days.

---

## Nudge Engine

The nudge engine answers:

**Who? Which benefit? When? Why?**

Example:

```text
Recent flight purchase
        +
Unused lounge visits
        +
Travel opportunity
        ↓
High-priority lounge recommendation
```

Example nudge:

> You have 2 lounge visits remaining this year. Your recent travel activity suggests you may be able to use this benefit on your next trip.

Show the reason behind recommendations.

---

## Customer Dashboard

The customer dashboard should focus on **maximizing benefit value**, not generic card management.

Required sections:

### Hero
```text
Welcome back

$420

Unrealized Benefit Value
```

### Benefit Health
```text
Benefit Health
82 / 100
```

This is a product engagement metric, not a credit score.

### Recommended Actions

Example:

```text
Dining Credit
$40 remaining
Expires in 5 days

[Use Benefit]
```

```text
Airport Lounge
2 visits remaining

[View Benefit]
```

### Benefit Portfolio

Show:
- benefit
- used amount
- remaining amount
- expiry
- estimated value

### Value Recovered

Show historical value recovered over time.

### Smart Benefit Tips

Examples:
- Dining credit expires soon.
- Lounge visits remain unused.
- Streaming credit has not been used this month.

---

## Issuer Dashboard

Call it **Benefit Intelligence Center** or **Issuer Analytics Dashboard**.

Required sections:

### KPI Summary
- Benefit Utilization Rate
- Benefit Recovery Rate
- Recommendation Conversion
- Customer Engagement
- Benefit ROI

### Benefit Utilization

Example:

```text
Dining Credit       85%
Lounge Access       58%
Streaming Credit    42%
Protection          70%
```

### Underutilized Benefits

Example:

```text
Streaming Credit
Utilization: 42%
Priority: High
Unrealized Value: $1.8M
```

### Campaign/Nudge Performance

Example:

```text
Dining Reminder       46%
Lounge Awareness      29%
Travel Nudge           52%
```

### Behavioral Segments

Use:
- Highly Engaged
- Needs Attention
- Inactive

Avoid sensitive personal segmentation.

### Benefit ROI

Example demo data:

```text
Benefit Investment       $2.8M
Recovered Customer Value $4.1M
```

Clearly label demo numbers as simulated.

### Recommended Business Actions

Examples:
- Increase awareness for underutilized streaming benefit.
- Target frequent travelers with lounge reminders.
- Prioritize customers with high unrealized benefit value.
- Test new timing strategies for dining nudges.

---

## Key Metrics

Expose these metrics consistently:

### Benefit Utilization Rate
Percentage of eligible benefits that are used.

### Benefit Recovery Rate
Percentage of unrealized benefit value recovered through the platform.

### Recommendation Conversion Rate
Percentage of recommendations resulting in benefit redemption.

### Customer Engagement Rate
Interactions with recommendations, notifications, and benefit pages.

### Benefit ROI
Business value generated relative to benefit investment.

### Retention
Treat as a future/experimental outcome unless real longitudinal data exists. Do not fabricate retention uplift.

---

## Data Integrity Rules

Clearly distinguish:

### Fact
```text
Customer has $40 remaining dining credit.
```

### Estimate
```text
Estimated lounge value: $100.
```

### Prediction
```text
82% predicted likelihood of redeeming lounge benefit.
```

### Recommendation
```text
Recommend lounge benefit now.
```

Never mix these concepts.

---

## Demo Customers

Seed at least 3–5 customers with different behavior.

### Customer A — Frequent Traveler
- recent airline spending
- unused lounge visits
- high travel opportunity
- expected recommendation: lounge access

### Customer B — Dining Heavy
- frequent restaurant transactions
- unused dining credit
- expected recommendation: dining credit

### Customer C — Low Engagement
- multiple unused benefits
- high unrealized value
- expected recommendation: benefit discovery/awareness

### Customer D — Highly Engaged
- uses most benefits
- low unrealized value
- system should avoid irrelevant nudges

This demonstrates both opportunity and restraint.

---

## Required End-to-End Demo

The prototype must demonstrate a real working loop:

```text
Open Customer Dashboard
        ↓
See Unrealized Benefit Value
        ↓
View Recommended Benefit
        ↓
See Why It Was Recommended
        ↓
Simulate Benefit Redemption
        ↓
Unrealized Value Decreases
        ↓
Recovered Value Increases
        ↓
Issuer Dashboard Metrics Update
```

Do not build only static screens.

---

## Recommended Demo Story

Primary scenario:

Customer starts with:

```text
$420 unrealized benefit value
```

System identifies:

```text
$40 dining credit
$100 lounge opportunity
$80 streaming credit
$200 protection opportunity
```

Customer recently spends at restaurants.

Dining credit is ranked highest.

Explanation:

> You recently spent at eligible restaurants and have $40 of dining credit remaining. The credit resets in 5 days.

User clicks **Use Benefit** and simulates redemption.

After redemption:

```text
Unrealized Value
$420 → $380

Recovered Value
$0 → $40
```

Issuer dashboard updates:

```text
Benefit Utilization ↑
Benefit Recovery ↑
Recommendation Conversion ↑
```

This demonstrates nearly the entire challenge.

---

## Scope Discipline

Do NOT build:
- payment processing
- real banking integration
- fraud detection
- credit scoring
- loan recommendations
- generic chatbot
- cryptocurrency
- blockchain
- unnecessary social features
- unrelated rewards optimization
- complex authentication infrastructure unless needed for the demo

Stay centered on:

**Benefit Underutilization Analytics**

---

## Issuer-Agnostic Design

The platform should work for card issuers generally across the industry.

Use concepts such as:

```text
Card Issuer
Card Product
Benefit Catalog
Benefit Rules
```

Do not hard-code issuer-specific logic into the core platform.

---

## Visual/Product Principles

The UI should feel like a polished modern fintech product.

Prioritize:
- clean typography
- strong whitespace
- intuitive navigation
- clear monetary values
- simple charts
- minimal clutter
- obvious recommendations
- clear explanations
- consistent terminology

Avoid:
- excessive gradients
- unnecessary animations
- huge AI branding
- cluttered dashboards
- fake enterprise complexity

Target feeling:

**Trust + Intelligence + Simplicity**

---

## Prototype vs Production

This is an initial prototype release.

Prioritize:

1. Working end-to-end flow
2. Correct benefit calculations
3. Good recommendation logic
4. Real interactions
5. Clear dashboards
6. Strong demo story
7. Clean architecture

Do not spend excessive time on production infrastructure that does not improve the demo.

Keep the code structured so it can evolve toward the architecture in the pitch deck.

---

## Definition of Done

- [ ] Customer can view eligible benefits.
- [ ] System calculates unused benefit value.
- [ ] Customer can see total unrealized value.
- [ ] System generates personalized recommendations.
- [ ] Recommendation includes an explanation.
- [ ] Nudge logic considers customer spending behavior.
- [ ] Customer can simulate/redeem a benefit.
- [ ] Unrealized value updates after redemption.
- [ ] Recovered value updates after redemption.
- [ ] Issuer dashboard reflects updated utilization.
- [ ] Issuer can identify underutilized benefits.
- [ ] Issuer can see campaign/nudge performance.
- [ ] Issuer can see benefit ROI metrics.
- [ ] Demo customers exhibit different behavior.
- [ ] Demo numbers are clearly identified as simulated where appropriate.
- [ ] Application runs locally with clear setup instructions.
- [ ] Core functionality works without external proprietary APIs.

---

## Most Important Instruction to the Coding Agent

Do not blindly implement every item if doing so makes the prototype unnecessarily complex.

First establish this minimum working vertical slice:

```text
Customer
    ↓
Transactions
    ↓
Eligibility
    ↓
Unused Benefit Value
    ↓
Recommendation
    ↓
Simulated Redemption
    ↓
Updated Metrics
    ↓
Issuer Analytics
```

Get this working end-to-end first.

Then improve UI, analytics, ML abstraction, and additional features.

The goal is not the largest codebase.

The goal is a **credible working demonstration of BenefitIQ's core intelligence loop**.

---

## Final Product Statement

> **BenefitIQ continuously identifies the benefits a card member is entitled to, quantifies the monetary value they have yet to use, determines which opportunity is most relevant based on their behavior, engages them at the right moment, measures the outcome, and learns from that outcome to improve future recommendations—while giving card issuers the analytics needed to measure utilization, engagement, and ROI.**

Build the prototype around this statement and do not drift away from it.
