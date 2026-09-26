"use client";

import Mascot from "@/components/Mascot";
import { useEffect, useState } from "react";

export default function Home() {
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function refillHearts() {
  try {
    const res = await fetch(
      "http://127.0.0.1:8000/api/me/hearts/refill",
      {
        method: "POST",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to refill hearts");
    }

    const data = await res.json();

    setProgress((prev: any) =>
      prev
        ? {
            ...prev,
            hearts: data.hearts,
          }
        : prev
    );
  } catch (err) {
    console.error(err);
  }
}
  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, progressRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/course"),
          fetch("http://127.0.0.1:8000/api/me"),
        ]);

        setCourse(await courseRes.json());
        setProgress(await progressRes.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="duo-loading">
        <Mascot state="encouraging" size={100} />
        <p>Loading your course...</p>
      </main>
    );
  }

  return (
    <main className="duo-home">

      {/* =====================================================
          TOP NAVIGATION
          ===================================================== */}

      <header className="duo-navbar">
        <div className="duo-navbar-inner">

          <button className="duo-logo">
            DuoLearn
          </button>

          <nav className="duo-stats">

            <div className="duo-stat">
              <span>🔥</span>
              <strong>
                {progress?.current_streak ?? 0}
              </strong>
            </div>

            <div className="duo-stat">
              <span>⭐</span>
              <strong>
                {progress?.total_xp ?? 0}
              </strong>
            </div>

             <div className="duo-stat stat-heart" title="Hearts">
  <span aria-hidden="true">❤️</span>
  <strong>{progress?.hearts ?? 0}</strong>

  <button
    type="button"
    className="heart-refill-btn"
    onClick={refillHearts}
  >
    Refill
  </button>
</div>

            <div className="duo-stat">
              <span>💎</span>
              <strong>
                {progress?.gems ?? 0}
              </strong>
            </div>

          </nav>
        </div>
      </header>


      {/* =====================================================
          COURSE HEADER
          ===================================================== */}

      <section className="duo-course-header">

  <div className="course-heading-content">
    <p className="duo-language">
      {course?.source_language} →{" "}
      {course?.target_language}
    </p>

    <h1>
      {course?.name}
    </h1>

    <p className="duo-subtitle">
      Continue your learning journey
    </p>
  </div>

  <div className="home-mascot">
    <Mascot
      state="happy"
      size={130}
    />
  </div>

</section>


      {/* =====================================================
          DAILY GOAL
          ===================================================== */}

      <section className="duo-dashboard">

        <div className="daily-goal-card">

          <div className="daily-goal-top">

            <div>
              <p className="card-label">
                DAILY GOAL
              </p>

              <h2>
                {progress?.daily_goal ?? 20} XP
              </h2>
            </div>

            <div className="goal-icon">
              🎯
            </div>

          </div>

          <div className="goal-track">

            <div
              className="goal-fill"
              style={{
                width: `${Math.min(
                  ((progress?.total_xp ?? 0) /
                    (progress?.daily_goal ?? 20)) *
                    100,
                  100
                )}%`,
              }}
            />

          </div>

          <p className="goal-message">
            {((progress?.total_xp ?? 0) >=
              (progress?.daily_goal ?? 20))
              ? "Daily goal completed! 🎉"
              : "Keep going!"}
          </p>

        </div>

      </section>


      {/* =====================================================
          LEARNING PATH
          ===================================================== */}

      <section className="learning-section">

        {course?.units?.map(
          (unit: any, unitIndex: number) => (

            <div
              key={unit.id}
              className="unit-container"
            >

              {/* UNIT HEADER */}

              <div className="unit-header">

                <div>
                  <p>
                    UNIT {unitIndex + 1}
                  </p>

                  <h2>
                    {unit.title}
                  </h2>

                  <span>
                    {unit.description}
                  </span>
                </div>

                <div className="unit-icon">
                  {unitIndex === 0
                    ? "🌱"
                    : unitIndex === 1
                    ? "📚"
                    : "🏆"}
                </div>

              </div>


              {/* PATH */}

              <div className="learning-path">

                <div className="path-line" />

                {unit.skills?.map(
                  (skill: any, index: number) => {

                    const isCompleted =
                      skill.status === "COMPLETED";

                    const isLocked =
                      skill.status === "LOCKED";

                    const isAvailable =
                      skill.status === "AVAILABLE";

                    /*
                     * Alternate nodes left/right
                     * to make the path feel organic.
                     */
                    const side =
                      index % 2 === 0
                        ? "path-left"
                        : "path-right";

                    return (
                      <div
                        key={skill.id}
                        className={`skill-row ${side}`}
                      >

                        <div className="skill-wrapper">

                          {/* MASCOT BESIDE ACTIVE NODE */}

                          {index === 0 && unitIndex === 0 && (
  <div className="path-mascot">
    <Mascot
      state={isCompleted ? "happy" : "encouraging"}
      size={130}
    />
  </div>
)}


                          {/* SKILL BUTTON */}

                          <button
                            disabled={isLocked}
                            onClick={() => {
                              if (
                                !isLocked &&
                                skill.lessons?.[0]?.id
                              ) {
                                window.location.href =
                                  `/lesson/${skill.lessons[0].id}`;
                              }
                            }}
                            className={`skill-node ${
                              isCompleted
                                ? "skill-completed"
                                : isLocked
                                ? "skill-locked"
                                : "skill-available"
                            }`}
                          >

                            <span className="skill-icon">

                              {isCompleted
                                ? "✓"
                                : isLocked
                                ? "🔒"
                                : "⭐"}

                            </span>

                          </button>


                          {/* LABEL */}

                          <div
                            className={`skill-label ${
                              isCompleted
                                ? "label-completed"
                                : isLocked
                                ? "label-locked"
                                : "label-available"
                            }`}
                          >

                            <strong>
                              {skill.title}
                            </strong>

                            <span>
                              {isCompleted
                                ? `Completed • ${
                                    skill.crown_level ?? 1
                                  } crown`
                                : isLocked
                                ? "Locked"
                                : `${
                                    skill.completion_percentage ??
                                    0
                                  }% complete`}
                            </span>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )
        )}

      </section>


      {/* =====================================================
          BOTTOM NAV
          ===================================================== */}

      <nav className="duo-bottom-nav">

        <button className="bottom-nav-item active">
          <span>🏠</span>
          <small>HOME</small>
        </button>

        <button className="bottom-nav-item">
          <span>📖</span>
          <small>LEARN</small>
        </button>

       <button
  className="bottom-nav-item"
  onClick={() => (window.location.href = "/leaderboard")}
>
  <span>🏆</span>
  <small>LEADERBOARD</small>
</button>

        <button
  className="bottom-nav-item"
  onClick={() => (window.location.href = "/profile")}
>
  <span>👤</span>
  <small>PROFILE</small>
</button>

      </nav>

    </main>
  );
}