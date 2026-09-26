"use client";

import { useEffect, useState } from "react";
import Mascot from "@/components/Mascot";

const API = "http://127.0.0.1:8000/api";

export default function ProfilePage() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/me`)
      .then((res) => res.json())
      .then((data) => setProgress(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="profile-page">
        <h2>Loading profile...</h2>
      </main>
    );
  }

  return (
    <main className="profile-page">

      {/* PROFILE CARD */}
      <section className="profile-card">

        <div className="profile-avatar">
          <Mascot state="happy" size={120} />
        </div>

        <h1>Aditi</h1>

        <p>Spanish learner 🇪🇸</p>

      </section>


      {/* STATS */}
      <section className="profile-stats">

        <div className="profile-stat">
          <span>🔥</span>
          <strong>{progress?.current_streak ?? 0}</strong>
          <small>Day streak</small>
        </div>

        <div className="profile-stat">
          <span>⭐</span>
          <strong>{progress?.total_xp ?? 0}</strong>
          <small>Total XP</small>
        </div>

        <div className="profile-stat">
          <span>🏆</span>
          <strong>{progress?.longest_streak ?? 0}</strong>
          <small>Longest streak</small>
        </div>

        <div className="profile-stat">
          <span>💎</span>
          <strong>{progress?.gems ?? 0}</strong>
          <small>Gems</small>
        </div>

      </section>


      {/* ACHIEVEMENTS */}
      <section className="profile-achievements">

        <h2>Achievements</h2>

        <div className="achievement">

          <span className="achievement-icon">
            🔥
          </span>

          <div>
            <strong>On Fire!</strong>
            <p>Keep your learning streak alive.</p>
          </div>

        </div>

        <div className="achievement">

          <span className="achievement-icon">
            ⭐
          </span>

          <div>
            <strong>XP Collector</strong>
            <p>Earn experience by completing lessons.</p>
          </div>

        </div>

        <div className="achievement">

          <span className="achievement-icon">
            🎯
          </span>

          <div>
            <strong>Daily Goal</strong>
            <p>Complete your daily XP goal.</p>
          </div>

        </div>

      </section>


      {/* HOME BUTTON */}
      <button
        className="profile-home-btn"
        onClick={() => (window.location.href = "/")}
      >
        Continue Learning
      </button>
      <button
  className="profile-settings-btn"
  onClick={() => (window.location.href = "/settings")}
>
  ⚙️ Settings
</button>
    </main>
  );
}