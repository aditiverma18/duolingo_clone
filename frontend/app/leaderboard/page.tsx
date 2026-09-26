"use client";

import { useEffect, useState } from "react";

const API = "https://duolingo-clone-jsi8.onrender.com/api";

const seededPlayers = [
  { name: "Sofia", xp: 420 },
  { name: "Lucas", xp: 350 },
  { name: "Emma", xp: 280 },
  { name: "Daniel", xp: 210 },
];

export default function LeaderboardPage() {
  const [myXp, setMyXp] = useState(0);

  useEffect(() => {
    fetch(`${API}/me`)
      .then((res) => res.json())
      .then((data) => setMyXp(data.total_xp ?? 0))
      .catch(console.error);
  }, []);

  const players = [
    ...seededPlayers,
    { name: "Aditi", xp: myXp, me: true },
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));

  return (
    <main className="leaderboard-page">

      <header className="leaderboard-header">
        <button
          onClick={() => (window.location.href = "/")}
          className="leaderboard-back"
        >
          ←
        </button>

        <div>
          <h1>Leaderboard</h1>
          <p>Compete with other learners</p>
        </div>
      </header>

      <section className="leaderboard-card">

        <div className="leaderboard-title">
          <span>🏆</span>
          <h2>Weekly XP</h2>
        </div>

        <div className="leaderboard-list">

          {players.map((player) => (
            <div
              key={player.name}
              className={`leaderboard-row ${
                (player as any).me ? "leaderboard-me" : "" 
              }`}
            >

              <div className="leaderboard-rank">
                {player.rank <= 3
                  ? ["🥇", "🥈", "🥉"][player.rank - 1]
                  : player.rank}
              </div>

              <div className="leaderboard-avatar">
                {(player as any).me ? "🦉" : "🙂"}
              </div>

              <div className="leaderboard-name">
                <strong>
                  {player.name}
                  {(player as any).me && " (You)"}
                </strong>
              </div>

              <div className="leaderboard-xp">
                ⭐ {player.xp} XP
              </div>

            </div>
          ))}

        </div>

      </section>

      <button
        className="leaderboard-home-btn"
        onClick={() => (window.location.href = "/")}
      >
        Continue Learning
      </button>

    </main>
  );
}
