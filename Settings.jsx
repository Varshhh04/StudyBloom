
import { useState } from "react";
import {
  Download,
  Trash2,
  Info,
  Palette,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import "./Pages.css";

const STORAGE_KEYS = [
  "studybloom-academic-subjects",
  "studybloom-academic-assignments",
  "studybloom-placement-skills",
  "studybloom-daily-goals",
  "studybloom-quick-notes",
  "studybloom-study-streak",
  "studybloom-hours",
  "studybloom-goals",
  "studybloom-study-sessions",
  "studybloom-weekly-target",
  "studybloom-study-sessions"
];

function Settings() {
  const [theme, setTheme] = useState(
    localStorage.getItem("studybloom-theme") || "pastel"
  );

  const [message, setMessage] = useState("");

  const exportData = () => {
    const backup = {};

    [...new Set(STORAGE_KEYS)].forEach(key => {
      backup[key] = localStorage.getItem(key);
    });

    backup["studybloom-theme"] = localStorage.getItem("studybloom-theme");

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "studybloom-backup.json";
    link.click();

    URL.revokeObjectURL(url);
    setMessage("Your StudyBloom backup has been downloaded!");
  };

  const resetData = () => {
    const confirmed = window.confirm(
      "Are you sure? This will permanently delete your saved StudyBloom data."
    );

    if (!confirmed) return;

    STORAGE_KEYS.forEach(key => localStorage.removeItem(key));

    setMessage(
      "Your StudyBloom data has been reset. Refresh the page to see the changes."
    );
  };

  const changeTheme = value => {
    setTheme(value);
    localStorage.setItem("studybloom-theme", value);
    window.dispatchEvent(new Event("studybloom-theme-change"));
    setMessage("Your appearance preference has been saved.");
  };

  return (
    <div className="page settings-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">MAKE IT YOURS</p>
          <h1>Settings ⚙️</h1>
          <p className="page-subtitle">
            Manage your StudyBloom preferences and personal data.
          </p>
        </div>
      </div>

      {message && (
        <div className="settings-message">
          <CheckCircle2 size={19} />
          <span>{message}</span>
        </div>
      )}

      <div className="settings-layout">

        <section className="page-card settings-section">
          <div className="settings-icon appearance-icon">
            <Palette size={23} />
          </div>

          <div className="settings-content">
            <h2>Appearance</h2>
            <p>Choose the colour theme for your StudyBloom workspace.</p>

            <div className="theme-options">
              <button
                className={`theme-option pastel-option ${
                  theme === "pastel" ? "selected" : ""
                }`}
                onClick={() => changeTheme("pastel")}
              >
                <span>🌸</span>
                <strong>Pastel Theme</strong>
                {theme === "pastel" && <CheckCircle2 size={18} />}
              </button>

              <button
                className={`theme-option lavender-option ${
                  theme === "lavender" ? "selected" : ""
                }`}
                onClick={() => changeTheme("lavender")}
              >
                <span>💜</span>
                <strong>Lavender Theme</strong>
                {theme === "lavender" && <CheckCircle2 size={18} />}
              </button>
            </div>
          </div>
        </section>

        <section className="page-card settings-section">
          <div className="settings-icon backup-icon">
            <Download size={23} />
          </div>

          <div className="settings-content">
            <h2>Backup Your Data</h2>
            <p>
              Keep a copy of your subjects, assignments, notes,
              study sessions and progress.
            </p>

            <button className="primary-button" onClick={exportData}>
              <Download size={17} />
              Export My Data
            </button>
          </div>
        </section>

        <section className="page-card settings-section danger-section">
          <div className="settings-icon danger-icon">
            <Trash2 size={23} />
          </div>

          <div className="settings-content">
            <h2>Reset StudyBloom</h2>
            <p>
              Delete your saved StudyBloom data from this browser.
              This action cannot be undone.
            </p>

            <button className="danger-button" onClick={resetData}>
              <Trash2 size={17} />
              Reset All Data
            </button>
          </div>
        </section>

        <section className="page-card settings-section">
          <div className="settings-icon about-icon">
            <Info size={23} />
          </div>

          <div className="settings-content">
            <h2>About StudyBloom</h2>
            <p>
              Your personal academic and placement preparation planner.
            </p>

            <div className="about-details">
              <span>Application</span>
              <strong>StudyBloom</strong>

              <span>Version</span>
              <strong>1.0.0</strong>

              <span>Purpose</span>
              <strong>Learn · Plan · Grow</strong>
            </div>
          </div>
        </section>

      </div>

      <div className="settings-footer">
        <Sparkles size={17} />
        <span>Keep growing, one day at a time.</span>
      </div>
    </div>
  );
}

export default Settings;
