# PlacementIQ — AI Placement Intelligence Agent

> **Hackathon Demo 2026** · Built with React + Vite + Node.js + Express · AI-powered with Google Gemini (mock mode available)

![PlacementIQ Banner](https://img.shields.io/badge/PlacementIQ-AI%20Placement%20Intelligence-6366f1?style=for-the-badge)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38bdf8)](https://tailwindcss.com)

---

## 🎯 Problem

University placement cells manage hundreds of students, dozens of companies, and thousands of data points — yet most decisions are still made based on gut feeling and spreadsheets. This leads to:

- Students remaining unplaced despite being eligible
- Companies leaving campus without filling positions
- No early warning system for at-risk students
- Skill gaps going unaddressed until it's too late
- Recruiters not being re-engaged effectively

---

## 💡 Solution

**PlacementIQ** is an AI-powered placement intelligence platform that:

1. **Analyses** placement data in real-time
2. **Detects** at-risk students before the season ends
3. **Matches** students to jobs with explainable AI scoring
4. **Answers** natural language questions from placement staff
5. **Recommends** specific, evidence-based actions with expected impact

---

## ✨ Features

### 👨‍🎓 Student Mode
- **Placement Readiness Score** (0–100 composite score)
- **Job Match Analysis** with percentage and breakdown
- **Skill Gap Analysis** — exactly which skills to learn
- **Best-fit Job Recommendations** with explanation
- **Profile View** — internships, certifications, projects

### 🏢 Management Dashboard
- **KPI Overview** — total students, placed, unplaced, average salary, highest salary
- **Department Analytics** — CSE, ECE, EEE, MECH, CIVIL breakdown
- **Interactive Charts** — placement %, salary trends, department comparison
- **AI Priorities Panel** — top 3 actions to take right now

### 🤖 AI Agent (Core Feature)
- Natural language Q&A interface
- 10+ specialized reasoning modules
- Structured output: Finding → Evidence → Reasoning → Recommendation → Expected Impact
- Works without any API key (mock mode)
- Upgrades to Gemini AI with `GEMINI_API_KEY`

### ⚠️ At-Risk Detection
- Risk scoring based on 7 measurable signals
- Expandable student cards with specific interventions
- High / Medium / Low classification

### 🧠 Skill Intelligence
- Top 25 demanded skills with trend indicators
- Department skill coverage scores
- AI training recommendations with priority ranking
- Rising vs stable skill analysis

### 🤝 Recruiter Intelligence
- Re-engagement priority scoring for all companies
- Historical hire analysis across 3 seasons
- Contact information for each recruiter
- Explanation of why each company should be approached

### 📊 Placement Trends
- Multi-year analysis (2023–2026)
- Year-over-year comparison with change indicators
- Department-wise trend lines
- Historical summary table

### 🔍 Application Gap Analysis
- Detects jobs where eligible students aren't applying
- Hypothesis-labeled explanations
- Actionable gap-closing recommendations

---

## 🏗️ Agent Architecture

```
User Question
      ↓
Intent Detection (10+ categories)
      ↓
Data Tool Selection (getStudents, getCompanies, getDepartmentAnalytics, etc.)
      ↓
Reasoning Engine (department-specific analysis modules)
      ↓
Evidence Collection (from seeded data)
      ↓
Recommendation Generation (with expected impact)
      ↓
[Optional] Gemini AI Enhancement
      ↓
Structured Response: Finding → Evidence → Reasoning → Recommendation → Impact
```

**Intent Categories:**
- `AT_RISK_STUDENTS` — risk analysis queries
- `DEPARTMENT_ANALYSIS` — underperformance queries
- `TOP_PRIORITIES` — "what should we do now" queries
- `RECRUITER_INTELLIGENCE` — company re-engagement queries
- `SKILL_DEMAND` — skill and training queries
- `SALARY_ANALYSIS` — compensation queries
- `APPLICATION_GAP` — engagement gap queries
- `PLACEMENT_TRENDS` — historical analysis queries
- `EEE_ANALYSIS` — specific department deep-dive
- `GENERAL` — overview and status queries

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express |
| AI | Google Gemini 1.5 Flash (optional) |
| Data | JSON seed files (replaceable with real DB) |
| HTTP Client | Axios |
| Routing | React Router v6 |

---

## 📁 Project Structure

```
placementiq/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Sidebar + top bar layout
│   │   │   └── UI.jsx              # Shared components
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Mode selection
│   │   │   ├── StudentMode.jsx     # Student profile + job matches
│   │   │   ├── ManagementDashboard.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── JobsPage.jsx
│   │   │   ├── CompaniesPage.jsx
│   │   │   ├── SkillIntelligence.jsx
│   │   │   ├── AtRiskStudents.jsx
│   │   │   ├── RecruiterIntelligence.jsx
│   │   │   ├── PlacementTrends.jsx
│   │   │   └── AICommandCenter.jsx
│   │   ├── services/
│   │   │   └── api.js              # API client
│   │   ├── hooks/
│   │   │   └── useApi.js           # Data fetching hook
│   │   └── index.css               # Global styles + Tailwind
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── agent/
│   │   └── placementAgent.js       # Core AI agent logic
│   ├── routes/
│   │   ├── students.js
│   │   ├── companies.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   ├── analytics.js
│   │   ├── skills.js
│   │   ├── atRisk.js
│   │   ├── recruiters.js
│   │   └── agent.js
│   ├── services/
│   │   └── dataService.js          # All agent tools + data access
│   ├── data/
│   │   ├── students.json           # 40 students
│   │   ├── companies.json          # 20 companies
│   │   ├── jobs.json               # 32 job openings
│   │   ├── applications.json       # 59 applications
│   │   ├── placement_history.json  # 4 seasons of data
│   │   └── skills.json             # 25 skills with trends
│   ├── server.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd placementiq

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment (Optional)

```bash
# Copy the example file
cp .env.example backend/.env

# Edit backend/.env and optionally add your Gemini key
# The app works in mock mode without any API key
```

### 3. Start Backend

```bash
cd backend
node server.js
# Backend starts at http://localhost:5000
```

### 4. Start Frontend (new terminal)

```bash
cd frontend
node node_modules/vite/bin/vite.js
# Frontend starts at http://localhost:5173
```

### 5. Open in Browser

Navigate to **http://localhost:5173**

---

## 🌍 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Google Gemini API key. App uses mock AI if not provided. |
| `PORT` | No | Backend port (default: 5000) |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |

---

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/health` | GET | Health check + AI mode |
| `GET /api/students` | GET | All students (with filters) |
| `GET /api/students/:id` | GET | Student profile |
| `GET /api/students/:id/matches` | GET | Job match analysis for student |
| `GET /api/companies` | GET | All companies |
| `GET /api/jobs` | GET | Job openings |
| `GET /api/analytics` | GET | Full analytics |
| `GET /api/analytics/overview` | GET | KPI overview |
| `GET /api/analytics/departments` | GET | Department stats |
| `GET /api/analytics/trends` | GET | Historical trends |
| `GET /api/skills` | GET | Skill demand + gaps |
| `GET /api/at-risk` | GET | At-risk students |
| `GET /api/recruiters` | GET | Recruiter intelligence |
| `GET /api/applications/gaps` | GET | Application gaps |
| `POST /api/agent/ask` | POST | AI agent Q&A |
| `GET /api/agent/priorities` | GET | Top 3 AI priorities |

---

## 🎬 Demo Scenarios

### Scenario 1: Student checks their best jobs
1. Click **Student Mode**
2. Select **Teja Reddy** (CSE, CGPA 8.2)
3. See **87% readiness score**, top job matches with percentages

### Scenario 2: Student sees skill gaps
1. In Student Mode → **Skill Analysis** tab
2. See Python, SQL, Docker missing from top matches

### Scenario 3: Management checks underperforming departments
1. Click **Management Mode** → **AI Command Center**
2. Type: _"Which departments are underperforming?"_
3. Agent identifies EEE at 38% — lowest in institution

### Scenario 4: Find at-risk students
1. Click **At-Risk Students** in sidebar
2. See 17 unplaced students sorted by risk score
3. High-risk students like Ramesh Yadav (0 applications) flagged

### Scenario 5: What to do right now
1. AI Command Center → _"What should management do right now?"_
2. Gets 3 prioritized actions with evidence

### Scenario 6: Recruiter re-engagement
1. **Recruiter Intelligence** page
2. DeepMind Analytics flagged as High Priority — 14 past hires, premium salary

---

## 🔮 Future Improvements

- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Student authentication and self-reporting
- [ ] Email automation for at-risk student notifications
- [ ] PDF report generation
- [ ] Mobile app (React Native)
- [ ] LLM fine-tuning on placement domain data
- [ ] Resume analysis and scoring
- [ ] Interview scheduling integration
- [ ] Alumni network insights
- [ ] Multi-institution support

---

## 📄 License

MIT License — free to use for educational and hackathon purposes.

---

*Built with ❤️ for the University Placement Cell · PlacementIQ Hackathon 2026*
