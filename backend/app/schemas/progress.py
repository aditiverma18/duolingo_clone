from datetime import date

from pydantic import BaseModel


class UserProgressResponse(BaseModel):
    total_xp: int
    current_streak: int
    longest_streak: int
    hearts: int
    gems: int
    daily_goal: int
    last_activity_date: date | None

    class Config:
        from_attributes = True


class AnswerResponse(BaseModel):
    is_correct: bool
    correct_answer: str | None
    hearts_remaining: int
    xp_earned: int


class CompleteLessonResponse(BaseModel):
    xp_earned: int
    total_xp: int
    hearts: int
    current_streak: int
    skill_progress: int