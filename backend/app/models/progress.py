from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    current_streak: Mapped[int] = mapped_column(Integer, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0)
    hearts: Mapped[int] = mapped_column(Integer, default=5)
    gems: Mapped[int] = mapped_column(Integer, default=0)
    daily_goal: Mapped[int] = mapped_column(Integer, default=20)
    last_activity_date: Mapped[date | None] = mapped_column(Date)

    user = relationship(
        "User",
        back_populates="progress"
    )


class SkillProgress(Base):
    __tablename__ = "skill_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.id"),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="LOCKED"
    )

    completion_percentage: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    crown_level: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="skill_progress"
    )

    skill = relationship(
        "Skill",
        back_populates="progress"
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "skill_id",
            name="uq_user_skill_progress"
        ),
    )


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="IN_PROGRESS"
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    xp_earned: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    hearts_lost: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    user = relationship(
        "User",
        back_populates="lesson_attempts"
    )

    exercise_attempts = relationship(
        "ExerciseAttempt",
        back_populates="lesson_attempt",
        cascade="all, delete-orphan"
    )


class ExerciseAttempt(Base):
    __tablename__ = "exercise_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    lesson_attempt_id: Mapped[int] = mapped_column(
        ForeignKey("lesson_attempts.id"),
        nullable=False
    )

    exercise_id: Mapped[int] = mapped_column(
        ForeignKey("exercises.id"),
        nullable=False
    )

    answer: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    answered_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    lesson_attempt = relationship(
        "LessonAttempt",
        back_populates="exercise_attempts"
    )

    exercise = relationship(
        "Exercise",
        back_populates="attempts"
    )


class DailyActivity(Base):
    __tablename__ = "daily_activity"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    activity_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    xp_earned: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    lessons_completed: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    user = relationship(
        "User",
        back_populates="daily_activity"
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "activity_date",
            name="uq_user_activity_date"
        ),
    )