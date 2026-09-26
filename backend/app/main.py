from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.database.seed import seed_database
from app.models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserProgress,
    SkillProgress,
    LessonAttempt,
    ExerciseAttempt,
    DailyActivity,
)

from app.api.course import router as course_router
from app.api.lessons import router as lesson_router
from app.api.users import router as user_router

Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="Duolingo Clone API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://duolingo-clone-9ts2zyhpq-aditi-57bd.vercel.app",
     ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(course_router)
app.include_router(lesson_router)
app.include_router(user_router)


@app.get("/")
def root():
    return {
        "message": "Duolingo API is running"
    }