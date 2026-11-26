
import { useEffect, useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  BookOpen,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import "./Pages.css";

const STORAGE_KEY = "studybloom-study-sessions";
const TARGET_KEY = "studybloom-weekly-target";

const subjects = [
  "AI for Engineers",
  "Applied Cryptography",
  "IoT and Data Analytics",
  "Linear Algebra & Probability Theory",
  "Deep Learning",
  "DSA & Problem Solving",
  "Java Programming",
  "DBMS & SQL",
  "Operating Systems",
  "Computer Networks",
  "Aptitude",
  "Project Work",
  "Other"
];

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function StudyTracker() {
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [weeklyTarget, setWeeklyTarget] = useState(() => {
    return Number(localStorage.getItem(TARGET_KEY)) || 20;
  });

  const [subject, setSubject] = useState("AI for Engineers");
  const [hours, setHours] = useState("1");
  const [date, setDate] = useState(getLocalDate());

  // Stopwatch states
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  // Save sessions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Save weekly target
  useEffect(() => {
    localStorage.setItem(TARGET_KEY, String(weeklyTarget));
  }, [weeklyTarget]);

  // Stopwatch interval
  useEffect(() => {
    if (!stopwatchRunning) return;

    const interval = setInterval(() => {
      setStopwatchSeconds(previous => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  // Add manual study session
  const addSession = event => {
    event.preventDefault();

    const duration = Number(hours);

    if (
      !subject.trim() ||
      !Number.isFinite(duration) ||
      duration <= 0 ||
      duration > 24
    ) {
      alert("Enter a valid subject and duration up to 24 hours.");
      return;
    }

    setSessions(previous => [
      {
        id: Date.now(),
        subject: subject.trim(),
        hours: duration,
        date
      },
      ...previous
    ]);

    setHours("1");
  };

  // Delete study session
  const deleteSession = id => {
    setSessions(previous =>
      previous.filter(session => session.id !== id)
    );
  };

  // Stopwatch formatting
  const formatStopwatch = () => {
    const h = Math.floor(stopwatchSeconds / 3600);
    const m = Math.floor((stopwatchSeconds % 3600) / 60);
    const s = stopwatchSeconds % 60;

    return [
      String(h).padStart(2, "0"),
      String(m).padStart(2, "0"),
      String(s).padStart(2, "0")
    ].join(":");
  };

  // Reset stopwatch
  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchSeconds(0);
  };

  // Save stopwatch session
  const saveStopwatchSession = () => {
    if (stopwatchSeconds < 60) {
      alert("Study for at least one minute before saving.");
      return;
    }

    const studiedHours = Number(
      (stopwatchSeconds / 3600).toFixed(2)
    );

    setSessions(previous => [
      {
        id: Date.now(),
        subject: subject.trim() || "General Study",
        hours: studiedHours,
        date: getLocalDate()
      },
      ...previous
    ]);

    resetStopwatch();
    alert("Your study session has been saved!");
  };

  // Date calculations
  const today = getLocalDate();

  const todayHours = sessions
    .filter(session => session.date === today)
    .reduce((total, session) => total + session.hours, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);

  const weeklyHours = sessions
    .filter(session => {
      const sessionDate = new Date(session.date + "T00:00:00");
      return sessionDate >= weekStart && sessionDate <= now;
    })
    .reduce((total, session) => total + session.hours, 0);

  // Weekly chart data
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - index));

    const dateKey = [
      day.getFullYear(),
      String(day.getMonth() + 1).padStart(2, "0"),
      String(day.getDate()).padStart(2, "0")
    ].join("-");

    const total = sessions
      .filter(session => session.date === dateKey)
      .reduce((sum, session) => sum + session.hours, 0);

    return {
      label: day.toLocaleDateString("en-US", {
        weekday: "short"
      }),
      hours: total
    };
  });

  const maxHours = Math.max(
    4,
    ...weeklyData.map(day => day.hours)
  );

  // Subject analytics
  const subjectData = Object.values(
    sessions.reduce((result, session) => {
      result[session.subject] = result[session.subject] || {
        subject: session.subject,
        hours: 0
      };

      result[session.subject].hours += session.hours;
      return result;
    }, {})
  );

  const maxSubjectHours = Math.max(
    1,
    ...subjectData.map(item => item.hours)
  );

  const targetProgress = weeklyTarget
    ? Math.min(100, (weeklyHours / weeklyTarget) * 100)
    : 0;

  return (
    <div className="page-container">

      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">TRACK YOUR GROWTH</p>
          <h1>Study Tracker 📚</h1>
          <p>Every hour you invest brings you closer to your goals.</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="progress-stats">
        <div className="progress-stat">
          <Clock size={22} />
          <h3>{todayHours.toFixed(1)} hrs</h3>
          <p>Today's Study</p>
        </div>

        <div className="progress-stat">
          <BookOpen size={22} />
          <h3>{weeklyHours.toFixed(1)} hrs</h3>
          <p>Last 7 Days</p>
        </div>

        <div className="progress-stat">
          <Plus size={22} />
          <h3>{sessions.length}</h3>
          <p>Total Sessions</p>
        </div>
      </div>

      {/* Stopwatch */}
      <section className="panel stopwatch-panel">
        <h3>⏱️ Study Stopwatch</h3>
        <p>Track your actual study time.</p>

        <div className="stopwatch-display">
          {formatStopwatch()}
        </div>

        <div className="timer-actions">
          <button
            className="primary-button"
            onClick={() => setStopwatchRunning(previous => !previous)}
          >
            {stopwatchRunning ? <Pause size={18} /> : <Play size={18} />}
            {stopwatchRunning ? "Pause" : "Start"}
          </button>

          <button
            className="secondary-button"
            onClick={resetStopwatch}
          >
            <RotateCcw size={18} />
            Reset
          </button>

          <button
            className="primary-button"
            onClick={saveStopwatchSession}
            disabled={stopwatchSeconds < 60}
          >
            <Plus size={18} />
            Save Session
          </button>
        </div>
      </section>

      {/* Weekly Target */}
      <section className="panel weekly-target-panel">
        <h3>🎯 Weekly Study Target</h3>
        <p>Set a target and work towards it consistently.</p>

        <div className="target-input-row">
          <label htmlFor="weeklyTarget">
            Target hours per week
          </label>

          <input
            id="weeklyTarget"
            type="number"
            min="1"
            max="168"
            value={weeklyTarget}
            onChange={event => {
              const value = event.target.value;

              if (value === "") {
                setWeeklyTarget("");
              } else if (
                Number.isInteger(Number(value)) &&
                Number(value) >= 1 &&
                Number(value) <= 168
              ) {
                setWeeklyTarget(Number(value));
              }
            }}
          />
        </div>

        <div className="target-progress-info">
          <strong>
            {weeklyHours.toFixed(1)} / {weeklyTarget || 0} hours
          </strong>

          <span>
            {weeklyTarget
              ? `${targetProgress.toFixed(0)}% completed`
              : "Enter a target"}
          </span>
        </div>

        <div className="target-progress-track">
          <div
            className="target-progress-bar"
            style={{ width: `${targetProgress}%` }}
          />
        </div>
      </section>

      {/* Weekly Chart */}
      <section className="panel weekly-study-panel">
        <h3>📊 Weekly Study Activity</h3>
        <p>Your study hours over the last 7 days.</p>

        <div className="weekly-study-chart">
          {weeklyData.map(day => (
            <div className="weekly-study-column" key={day.label}>
              <span>{day.hours.toFixed(1)}h</span>

              <div className="weekly-study-track">
                <div
                  className="weekly-study-bar"
                  style={{
                    height: `${(day.hours / maxHours) * 100}%`
                  }}
                />
              </div>

              <small>{day.label}</small>
            </div>
          ))}
        </div>
      </section>

      {/* Add Study Session */}
      <section className="panel">
        <h3>➕ Add Study Session</h3>

        <form
          className="study-session-form"
          onSubmit={addSession}
        >
          <label htmlFor="studySubject">Subject</label>

          <select
            id="studySubject"
            value={subject}
            onChange={event => setSubject(event.target.value)}
            required
          >
            {subjects.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="studyHours">Study Duration (hours)</label>

          <input
            id="studyHours"
            type="number"
            min="0.25"
            max="24"
            step="0.25"
            value={hours}
            onChange={event => setHours(event.target.value)}
            required
          />

          <label htmlFor="studyDate">Study Date</label>

          <input
            id="studyDate"
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            max={today}
            required
          />

          <button type="submit" className="primary-button">
            <Plus size={17} />
            Add Session
          </button>
        </form>
      </section>

      {/* Subject Analytics */}
      <section className="panel subject-analytics">
        <h3>📚 Subject-wise Study Analytics</h3>
        <p>See where your study time goes.</p>

        {subjectData.length === 0 ? (
          <p>Add study sessions to see subject analytics.</p>
        ) : (
          <div className="subject-analytics-list">
            {subjectData.map(item => (
              <div
                className="subject-analytics-item"
                key={item.subject}
              >
                <div className="subject-analytics-heading">
                  <strong>{item.subject}</strong>
                  <span>{item.hours.toFixed(1)} hrs</span>
                </div>

                <div className="subject-analytics-track">
                  <div
                    className="subject-analytics-bar"
                    style={{
                      width: `${(item.hours / maxSubjectHours) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Study History */}
      <section className="panel">
        <h3>📖 Study History</h3>

        {sessions.length === 0 ? (
          <p>No study sessions yet. Add your first session!</p>
        ) : (
          <div className="study-session-list">
            {sessions.map(session => (
              <div
                className="study-session-item"
                key={session.id}
              >
                <div>
                  <strong>{session.subject}</strong>
                  <p>
                    {session.date} · {session.hours} hours
                  </p>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteSession(session.id)}
                  aria-label={`Delete ${session.subject} session`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default StudyTracker;
