from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    unit_id: Mapped[int] = mapped_column(
        ForeignKey("units.id"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    xp_reward: Mapped[int] = mapped_column(
        Integer,
        default=10
    )

    unit = relationship(
        "Unit",
        back_populates="skills"
    )

    lessons = relationship(
        "Lesson",
        back_populates="skill",
        cascade="all, delete-orphan"
    )

    progress = relationship(
        "SkillProgress",
        back_populates="skill",
        cascade="all, delete-orphan"
    )