# BenefitIQ — Comprehensive Project Handover & Architecture Guide

> **Welcome Agent / Developer!**  
> This document is designed as an onboarding and reference manual for anyone taking over or reviewing the **BenefitIQ** codebase. It contains the problem statement, system architecture, API specifications, ML/rules engine logic, user interactions log (questions, explanations, user requests), and setup instructions.

---

## 1. Executive Summary & Problem Context

### What is BenefitIQ?
**BenefitIQ** is a **dual-sided continuous benefit intelligence platform** designed for card issuers (e.g., Chase, Citi, Capital One) and card members.

### The Core Problem: Benefit Underutilization
- **For Card Members:** Millions of dollars in premium credit card perks (dining credits, airport lounge passes, streaming credits, purchase protection) expire unused every year because members forget or don't know they are eligible.
- **For Card Issuers:** Issuers invest millions in benefit portfolios to drive customer retention and engagement, but struggle to measure unredeemed value, quantify ROI, or nudge customers at the right moment.

### The 5-Step Intelligence Cycle
```
   IDENTIFY ──► QUANTIFY ──► ENGAGE ──► MEASURE ──► LEARN
       ▲                                               │
       └───────────────────────────────────────────────┘
```
1. **IDENTIFY:** Determine eligible benefits based on card product and member profile.
2. **QUANTIFY:** Calculate exact remaining credit, visit-based value, and potential protection coverage.
3. **ENGAGE:** Rank highest-opportunity benefits using spending signals (MCC codes) and deliver explainable nudges.
4. **MEASURE:** Track when a user interacts or redeems a benefit, computing recovered value.
5. **LEARN:** Feed redemption data back into issuer analytics and future recommendation scoring.

---

## 2. Project Architecture & Tech Stack

```
BenefitIQ/
├── docs/
│   ├── BenefitIQ_Idea_Submission.pptx        # Product pitch presentation deck
│   ├── BenefitIQ_Codex_Prototype_Context.md   # Original prototype context & guidelines
│   └── PROJECT_HANDOVER.md                    # THIS DOCUMENT
├── backend/
│   ├── main.py            # FastAPI entrypoint, REST API endpoints & CORS
│   ├── database.py        # SQLite connection & SQLAlchemy session management
│   ├── models.py          # SQLAlchemy ORM models (Customer, Benefit, Transaction, CustomerBenefit, NudgeEvent)
│   ├── schemas.py         # Pydantic response/request validation schemas
│   ├── engine.py          # Benefit Valuation & Deterministic Opportunity Ranking Engine
│   ├── seed.py            # Mock database seeding script (4 distinct customer profiles & transactions)
│   └── static/
│       └── index.html     # Zero-dependency interactive React + Tailwind CSS dashboard UI
├── frontend/
│   ├── src/
│   │   ├── components/    # shadcn-inspired UI components (Cards, Badges, Tabs, Dialogs, Header)
│   │   ├── pages/         # CustomerDashboard.tsx and IssuerDashboard.tsx
│   │   ├── services/      # api.ts (backend client with real-time state sync)
│   │   ├── types/         # TypeScript interfaces matching backend schemas
│   │   ├── App.tsx        # Top-level navigation and customer switcher
│   │   └── main.tsx       # Vite React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .gitignore             # Repository git ignore definitions
└── README.md              # Repository entrypoint
```

### Technology Choices:
- **Backend:** Python 3.10+, FastAPI, SQLAlchemy, SQLite, Pydantic.
- **Frontend:** React 18 / 19, TypeScript, Vite, Tailwind CSS, shadcn/ui design language, Lucide Icons, Recharts.
- **State & Data Flow:** REST API with immediate optimistic and verified state mutation upon benefit redemption.

---

## 3. User Interactions & Decision Log

| Phase / Trigger | User Query / Feedback | Agent Explanation & Action |
|---|---|---|
| **Phase 1: Kickoff** | "Hey read the files and the project prototyoe details in this benefitQ folder and do teh prototye" | Analyzed `BenefitIQ_Codex_Prototype_Context.md`. Identified key requirements: dual-sided platform (Customer + Issuer), 5-step intelligence cycle, 4 distinct customer personas, explainable recommendation logic, real-time redemption loop. Created formal `implementation_plan.md`. |
| **Phase 2: Plan Approval** | User approved the plan. | Created task breakdown (`task.md`) and started setting up backend models, database, engine, and API. |
| **Phase 3: Package Manager Clarification** | "Hey use uv now pip" | Executed Python package installation, generated SQLite database, and seeded mock data. |
| **Phase 5: User Direction & shadcn UI** | "Yeah go ahead! But from now on, I need you to make teh documenattion of whatver you are making..My questions, your explanations and all so that another fesh agnet can pick this roject up easily by understand teh docs! and use shadcn for frontend!" | Created `PROJECT_HANDOVER.md` capturing all interactions, Q&A, and technical specs. Switched frontend design to high-quality **shadcn/ui** component styling with Tailwind CSS, Lucide icons, and Recharts. |
| **Phase 6: Frontend Runtime & Node Detection** | "what are you trying to do?" | **Explanation given:** All React + TypeScript + shadcn UI components, dashboards, and API clients are written. When executing `npm install`, Node.js/npm was not found in the current system PATH. The agent checked common installation directories to link Node.js, or offer to serve the standalone React + Tailwind frontend directly via FastAPI for seamless zero-dependency execution. |
| **Phase 7: Server Launch Justification & Execution** | "First can you telll me why you require this command!!Every time you ask me permission ,,You tell me why" | **Explanation given:** Explained the exact purpose of `python -m uvicorn main:app --host 127.0.0.1 --port 8000`: it starts the BenefitIQ web server, hosting the REST APIs (`/api/customers`, `/api/benefits/redeem`, `/api/issuer/analytics`) and serving the complete interactive BenefitIQ dashboard at `http://localhost:8000`. |
| **Phase 9: 404 Dashboard & `toFixed` Error Fix** | User shared screenshot of 404 on `/api/customers/2/dashboard` causing `toFixed` TypeError in browser console. | **Explanation & Fix:** Identified root cause: SQLite database path was relative, causing empty DB when launched from parent directory. Fixed by converting `database.py` to use absolute paths, adding auto-seeding on server startup in `main.py`, and adding defensive null checks in `index.html`. |
| **Phase 10: Git Repository Setup** | "add a gitignore" | Added root `.gitignore` filtering Python bytecode (`__pycache__`), virtual environments (`venv/`), SQLite databases (`*.db`), Node modules (`node_modules/`), dist builds, and OS/IDE metadata. |
| **Phase 11: Documentation & Presentation Reorganization** | "Hey you should cmmit the ppt i guess or atlest rearrage themi n teh docs section?" | Created `docs/` directory, moved `BenefitIQ_Idea_Submission.pptx`, `BenefitIQ_Codex_Prototype_Context.md`, and `PROJECT_HANDOVER.md` into `docs/`. Created a clean root `README.md` linking all assets. |
| **Phase 12: Pristine Git Branch Setup (`master`)** | "I dont want the main previous branch hwhich has that name to exist... deleting that and making master..." | **Action taken:** Verified complete removal of legacy terms across git index. Created clean orphan branch `master` with zero prior commit history. |

---

## 4. Demo Customer Personas

The seed script (`backend/seed.py`) configures 4 distinct personas to demonstrate intelligence and restraint:

1. **Customer A: Alice (Frequent Traveler)**
   - *Spending:* Delta Airlines ($450)
   - *Entitlements:* 3/4 Airport Lounge Access visits unused, Dining Credit ($50)
   - *Intelligence Output:* Ranked **Airport Lounge Access** as top nudge because of recent airline spending.
2. **Customer B: Bob (Dining Heavy)**
   - *Spending:* Steakhouse ($120)
   - *Entitlements:* $40 remaining in Dining Credit (resets in 5 days), Streaming Credit ($20), Lounge Access ($100 est. value), Purchase Protection ($500).
   - *Total Unrealized Value:* **$660 ($420 liquid credits/visits + $240+ protection)**.
   - *Intelligence Output:* Ranked **Dining Credit** highest (Score: 88+) with explanation: *"Recommended because you have $40 remaining, recently spent at eligible restaurants, and the benefit resets soon."*
3. **Customer C: Charlie (Low Engagement)**
   - *Spending:* Minimal / Groceries ($40)
   - *Entitlements:* All 4 benefits untouched (High unrealized value).
   - *Intelligence Output:* High-priority discovery nudge to onboard to member benefits.
4. **Customer D: Diana (Highly Engaged)**
   - *Spending:* Netflix ($15), Cafe ($85)
   - *Entitlements:* All credits utilized ($0 unrealized value, high recovered value).
   - *Intelligence Output:* Restraint: No spammy nudges shown. Congratulatory health score (100%).

---

## 5. API Endpoints Reference

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/customers` | Returns all customer profiles and their behavioral segments. |
| `GET` | `/api/customers/{id}/dashboard` | Returns full dashboard payload: unrealized value, recovered value, health score, benefit portfolio, and ranked explainable recommendations. |
| `POST` | `/api/benefits/redeem` | Simulates redeeming a benefit (`{ customer_id, benefit_id }`). Marks benefit used, logs `NudgeEvent`, updates recovered value and issuer aggregate stats. |
| `GET` | `/api/issuer/analytics` | Returns issuer-wide utilization rate, recovery rate, campaign conversion, ROI, underutilized benefits, and category breakdowns. |

---

## 6. How to Run the Project

### Running the Backend:
```bash
cd backend
python seed.py               # (Re)seeds SQLite database
python -m uvicorn main:app --reload --port 8000
```
Backend will run at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### Running the Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`.
