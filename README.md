# BenefitIQ — Continuous Benefit Intelligence Platform

> **Dual-sided continuous benefit intelligence & underutilization analytics platform for card members and card issuers.**

---

## 📁 Repository Structure

```
BenefitIQ/
├── docs/
│   ├── BenefitIQ_Idea_Submission.pptx        # Product pitch deck / presentation
│   ├── BenefitIQ_Codex_Prototype_Context.md   # Product requirements & specification
│   └── PROJECT_HANDOVER.md                    # Comprehensive architecture, user interaction log & developer guide
├── backend/
│   ├── main.py            # FastAPI REST server & static HTML UI router
│   ├── database.py        # SQLite database connection & session setup
│   ├── models.py          # SQLAlchemy ORM models (Customer, Benefit, Transaction, CustomerBenefit, NudgeEvent)
│   ├── schemas.py         # Pydantic validation schemas
│   ├── engine.py          # Benefit Valuation & Deterministic Opportunity Ranking Engine
│   ├── seed.py            # Automatic seed script for demo personas
│   └── static/
│       └── index.html     # Zero-dependency interactive React + Tailwind CSS dashboard UI
├── frontend/              # Modular Vite + React + TypeScript source code
│   ├── src/
│   │   ├── components/    # shadcn-style UI components (Cards, Badges, Buttons, Navbar, HeroMetric, NudgeBanner)
│   │   ├── pages/         # CustomerDashboard.tsx and IssuerDashboard.tsx
│   │   └── services/      # API client
│   └── package.json
├── .gitignore             # Git exclusions
└── README.md              # Project overview
```

---

## ⚡ Quick Start

Start the Python backend server (which automatically seeds demo data and hosts the web UI):

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

Open your browser at:
- 🌐 **Interactive Web UI:** [http://localhost:8000/](http://localhost:8000/)
- 📖 **Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📚 Documentation & Presentation Assets

All pitch materials, documentation, and design specifications are organized in the [`docs/`](file:///c:/Users/maruthi.n.marella/Downloads/BenefitIQ/docs) directory:

1. **[BenefitIQ_Idea_Submission.pptx](file:///c:/Users/maruthi.n.marella/Downloads/BenefitIQ/docs/BenefitIQ_Idea_Submission.pptx)** — Product pitch presentation deck.
2. **[PROJECT_HANDOVER.md](file:///c:/Users/maruthi.n.marella/Downloads/BenefitIQ/docs/PROJECT_HANDOVER.md)** — Comprehensive architecture, API spec, and full user interaction / decision log.
3. **[BenefitIQ_Codex_Prototype_Context.md](file:///c:/Users/maruthi.n.marella/Downloads/BenefitIQ/docs/BenefitIQ_Codex_Prototype_Context.md)** — Prototype specification and product lifecycle rules (`IDENTIFY → QUANTIFY → ENGAGE → MEASURE → LEARN`).
