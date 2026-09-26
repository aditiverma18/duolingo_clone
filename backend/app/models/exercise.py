from enum import Enum

from sqlalchemy import ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class ExerciseType(str, Enum):
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    TRANSLATE = "TRANSLATE"
    MATCH_PAIRS = "MATCH_PAIRS"
    FILL_BLANK = "FILL_BLANK"
    TYPE_ANSWER = "TYPE_ANSWER"


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=False
    )

    type: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    prompt: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    correct_answer: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    config_json: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True
    )

    lesson = relationship(
        "Lesson",
        back_populates="exercises"
    )

    attempts = relationship(
        "ExerciseAttempt",
        back_populates="exercise",
        cascade="all, delete-orphan"
    )