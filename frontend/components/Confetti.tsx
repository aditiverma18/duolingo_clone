"use client";

import type { CSSProperties } from "react";

const COLORS = ["#58cc02", "#1cb0f6", "#ff4b4b", "#ffc800", "#ce82ff", "#ff9600"];

/* Deterministic pseudo-random so render stays pure. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const PIECES = Array.from({ length: 90 }, (_, i) => ({
  left: rand(i + 1) * 100,
  delay: rand(i + 101) * 0.6,
  duration: 2.2 + rand(i + 201) * 1.6,
  drift: (rand(i + 301) - 0.5) * 220,
  spin: 360 + rand(i + 401) * 720,
  width: 7 + rand(i + 501) * 7,
  height: 10 + rand(i + 601) * 10,
  round: rand(i + 701) > 0.75,
  color: COLORS[i % COLORS.length],
}));

export default function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: `${p.left}%`,
              width: p.round ? p.width : p.width * 0.8,
              height: p.round ? p.width : p.height,
              borderRadius: p.round ? "50%" : 2,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": `${p.drift}px`,
              "--spin": `${p.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
