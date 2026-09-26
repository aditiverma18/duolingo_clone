from pydantic import BaseModel
from app.services.lesson_service import complete_lesson
from app.schemas.exercise import ExerciseResponse


class LessonResponse(BaseModel):
    id: int
    title: str
    position: int
    xp_reward: int

    exercises: list[ExerciseResponse]

    class Config:
        from_attributes = True