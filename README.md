# DuoLearn – Duolingo Web Clone

A full-stack Duolingo-inspired language learning application built as part of a software engineering assignment.

The application provides a learning path with lessons, interactive exercises, XP, streaks, hearts, skill progress, leaderboard, profile, and gamification features.

## Live Demo

Frontend: [Add Vercel URL]

Backend API: https://duolingo-clone-jsi8.onrender.com

## GitHub

https://github.com/aditiverma18/duolingo_clone

---

# Tech Stack

### Frontend
- Next.js
- TypeScript
- React
- CSS
- REST API integration

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic

### Database
- SQLite

### Deployment
- Vercel – Frontend
- Render – Backend

---

# Features

- Duolingo-style learning path
- Course → Unit → Skill → Lesson structure
- Multiple exercise types:
  - Multiple choice
  - Translation
  - Match pairs
  - Fill in the blank
  - Type answer
- Immediate answer feedback
- Hearts system
- XP system
- Daily goal
- Streak tracking
- Skill completion and unlocking
- Profile and statistics
- Leaderboard
- Gems
- Mocked heart refill
- Confetti/completion feedback
- Responsive UI
- Seeded course and learner data

The assignment allows simplified authentication, seeded leaderboard data, mocked gems, and a single seeded language course. 

---

# Architecture

The application follows a layered full-stack architecture:

```text
                    ┌─────────────────────┐
                    │     Next.js UI      │
                    │     TypeScript      │
                    └──────────┬──────────┘
                               │
                         REST API / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │     API Layer       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Service Layer    │
                    │ Business Logic      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Repository Layer   │
                    │ Database Operations │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     SQLAlchemy      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       SQLite        │
                    └─────────────────────┘
