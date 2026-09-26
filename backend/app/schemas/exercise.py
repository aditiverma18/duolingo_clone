from typing import Any

from pydantic import BaseModel


class ExerciseResponse(BaseModel):
    id: int
    type: str
    position: int
    prompt: str
    correct_answer: str | None
    config_json: dict[str, Any] | None

    class Config:
        from_attributes = True


class AnswerRequest(BaseModel):
    exercise_id: int
    answer: str