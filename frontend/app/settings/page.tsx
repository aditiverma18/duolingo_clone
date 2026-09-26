"use client";

export default function SettingsPage() {
  return (
    <main className="settings-page">
      <div className="settings-card">
        <div className="settings-icon">⚙️</div>

        <h1>Settings</h1>

        <p>
          Settings and account preferences are coming soon.
        </p>

        <button onClick={() => (window.location.href = "/")}>
          Back to Learning
        </button>
      </div>
    </main>
  );
}