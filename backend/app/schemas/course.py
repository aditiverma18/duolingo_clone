from pydantic import BaseModel
from app.schemas.lesson import LessonResponse

class SkillResponse(BaseModel):
    id: int
    title: str
    description: str | None
    position: int
    xp_reward: int

    status: str = "LOCKED"
    completion_percentage: int = 0
    crown_level: int = 0

    lessons: list[LessonResponse] = []

    class Config:
        from_attributes = True

class UnitResponse(BaseModel):
    id: int
    title: str
    description: str | None
    position: int

    skills: list[SkillResponse]

    class Config:
        from_attributes = True


class CourseResponse(BaseModel):
    id: int
    name: str
    source_language: str
    target_language: str
    description: str | None

    units: list[UnitResponse]

    class Config:
        from_attributes = True