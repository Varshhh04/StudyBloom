
import { useState, useEffect } from "react";
import {
  BookOpen, Code2, Clock, Target, TrendingUp,
  CheckCircle2, Flame, CalendarDays, BarChart3
} from "lucide-react";
import "./Pages.css";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SESSION_KEY = "studybloom-study-sessions";
const TARGET_KEY = "studybloom-weekly-target";
const STREAK_KEY = "studybloom-study-streak";

function getLocalDate(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      date: getLocalDate(date),
      label: date.toLocaleDateString("en-IN", {
        weekday: "short"
      })
    };
  });
}

function Progress() {
  const [hours, setHours] = useState(() => {
    const saved = localStorage.getItem("studybloom-hours");
    return saved ? JSON.parse(saved) : [2, 1.5, 2, 1, 2, 3, 0];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("studybloom-goals");
    return saved ? JSON.parse(saved) : {
      academic: false,
      placement: false,
      revision: false,
      practice: false
    };
  });

  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(SESSION_KEY)
      ) || [];
    } catch {
      return [];
    }
  });

  const [weeklyTarget] = useState(() => {
    return Number(localStorage.getItem(TARGET_KEY)) || 20;
  });

  const [streak] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STREAK_KEY)) || {
        current: 0
      };
    } catch {
      return { current: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem("studybloom-hours", JSON.stringify(hours));
  }, [hours]);

  useEffect(() => {
    localStorage.setItem("studybloom-goals", JSON.stringify(goals));
  }, [goals]);

  // Read the latest study sessions whenever this page is opened.
  useEffect(() => {
    const loadSessions = () => {
      try {
        setSessions(
          JSON.parse(localStorage.getItem(SESSION_KEY)) || []
        );
      } catch {
        setSessions([]);
      }
    };

    loadSessions();
    window.addEventListener("focus", loadSessions);

    return () => {
      window.removeEventListener("focus", loadSessions);
    };
  }, []);

  const today = getLocalDate();
  const lastSevenDays = getLastSevenDays();

  const totalStudyHours = sessions.reduce(
    (sum, session) => sum + (Number(session.hours) || 0),
    0
  );

  const todayHours = sessions
    .filter(session => session.date === today)
    .reduce((sum, session) => sum + (Number(session.hours) || 0), 0);

  const weeklyHours = sessions
    .filter(session =>
      lastSevenDays.some(day => day.date === session.date)
    )
    .reduce((sum, session) => sum + (Number(session.hours) || 0), 0);

  const dailyAverage = (weeklyHours / 7).toFixed(1);

  const weeklyProgress = Math.min(
    (weeklyHours / weeklyTarget) * 100,
    100
  );

  const completedGoals = Object.values(goals).filter(Boolean).length;

  const subjectHours = sessions.reduce((result, session) => {
    const subject = session.subject || "Other";
    result[subject] = (result[subject] || 0) +
      (Number(session.hours) || 0);
    return result;
  }, {});

  const subjectEntries = Object.entries(subjectHours)
    .sort((a, b) => b[1] - a[1]);

  const dailyActivity = lastSevenDays.map(day => {
    const total = sessions
      .filter(session => session.date === day.date)
      .reduce((sum, session) => sum + (Number(session.hours) || 0), 0);

    return { ...day, hours: total };
  });

  const maxDailyHours = Math.max(
    ...dailyActivity.map(day => day.hours),
    1
  );

  const toggleGoal = (name) => {
    setGoals(previous => ({
      ...previous,
      [name]: !previous[name]
    }));
  };

  const updateHours = (index, value) => {
    const updated = [...hours];
    updated[index] = Math.max(0, Math.min(12, Number(value) || 0));
    setHours(updated);
  };

  return (
    <div className="page">
      <h1>My Progress Tracker 📊</h1>
      <p className="page-subtitle">
        Celebrate your consistency and keep improving every week.
      </p>

      {/* Actual Study Tracker Analytics */}
      <div className="analytics-heading">
        <h2>🌷 Study Analytics</h2>
        <p>Your recorded study performance</p>
      </div>

      <div className="progress-stats">
        <div className="progress-stat pink">
          <BookOpen size={23} />
          <span>Total Study Hours</span>
          <h2>{totalStudyHours.toFixed(1)} hrs</h2>
        </div>

        <div className="progress-stat purple">
          <Clock size={23} />
          <span>Today's Study Time</span>
          <h2>{todayHours.toFixed(1)} hrs</h2>
        </div>

        <div className="progress-stat peach">
          <CalendarDays size={23} />
          <span>Last 7 Days</span>
          <h2>{weeklyHours.toFixed(1)} hrs</h2>
        </div>

        <div className="progress-stat green">
          <Flame size={23} />
          <span>Current Study Streak</span>
          <h2>{streak.current || 0} days</h2>
        </div>
      </div>

      {/* Weekly Target */}
      <div className="page-card">
        <div className="panel-heading">
          <h2>🎯 Weekly Study Target</h2>
          <span>
            {weeklyHours.toFixed(1)} / {weeklyTarget} hrs
          </span>
        </div>

        <div className="progress">
          <div style={{ width: `${weeklyProgress}%` }} />
        </div>

        <p className="analytics-description">
          {weeklyHours >= weeklyTarget
            ? "Amazing! You achieved your weekly study target! 🎉"
            : `${Math.max(0, weeklyTarget - weeklyHours).toFixed(1)} hours remaining to reach your weekly target.`}
        </p>
      </div>

      {/* Weekly Activity */}
      <div className="page-card">
        <div className="panel-heading">
          <h2>📅 Weekly Study Activity</h2>
          <span>Last 7 days</span>
        </div>

        <div className="analytics-chart">
          {dailyActivity.map(day => (
            <div className="analytics-column" key={day.date}>
              <strong>{day.hours.toFixed(1)}h</strong>

              <div className="analytics-track">
                <div
                  className="analytics-bar"
                  style={{
                    height: `${day.hours / maxDailyHours * 100}%`
                  }}
                />
              </div>

              <span>{day.label}</span>
            </div>
          ))}
        </div>

        <p className="analytics-description">
          Average study time: {dailyAverage} hours per day
        </p>
      </div>

      {/* Subject Analytics */}
      <div className="page-card">
        <div className="panel-heading">
          <h2>📚 Subject-wise Study Time</h2>
          <BarChart3 size={21} />
        </div>

        {subjectEntries.length === 0 ? (
          <p className="analytics-empty">
            No study sessions recorded yet.
            Start using your Study Tracker to see subject analytics!
          </p>
        ) : (
          <div className="subject-analytics-list">
            {subjectEntries.map(([subject, subjectTime]) => {
              const percentage = totalStudyHours > 0
                ? (subjectTime / totalStudyHours) * 100
                : 0;

              return (
                <div className="subject-analytics-item" key={subject}>
                  <div className="subject-analytics-info">
                    <strong>{subject}</strong>
                    <span>{subjectTime.toFixed(1)} hrs</span>
                  </div>

                  <div className="subject-analytics-track">
                    <div
                      className="subject-analytics-bar"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <small>{percentage.toFixed(1)}% of total study time</small>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Daily Goals */}
      <div className="page-card">
        <div className="panel-heading">
          <h2>📚 Academic & Placement Goals</h2>
          <span>{completedGoals * 25}% completed</span>
        </div>

        <div className="progress">
          <div style={{ width: `${completedGoals * 25}%` }} />
        </div>

        {[
          ["academic", "Revise at least one academic subject", "📚"],
          ["placement", "Practise DSA or programming", "💻"],
          ["revision", "Revise previously learned concepts", "📝"],
          ["practice", "Solve aptitude or SQL questions", "🎯"]
        ].map(([id, label, emoji]) => (
          <button
            className="topic-item"
            key={id}
            onClick={() => toggleGoal(id)}
          >
            {goals[id]
              ? <CheckCircle2 size={19} />
              : <span>{emoji}</span>}

            <span className={goals[id] ? "completed-topic" : ""}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Existing Manual Weekly Hours */}
      <div className="page-card hours-card">
        <div className="panel-heading">
          <h2>⏰ Manual Weekly Study Log</h2>
          <span>Enter your actual hours</span>
        </div>

        <div className="weekly-chart">
          {hours.map((value, index) => (
            <div className="chart-column" key={days[index]}>
              <strong>{value}h</strong>

              <div className="chart-track">
                <div
                  className="chart-bar"
                  style={{
                    height: `${value / Math.max(...hours, 1) * 100}%`
                  }}
                />
              </div>

              <span>{days[index]}</span>

              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={value}
                onChange={e => updateHours(index, e.target.value)}
                aria-label={`${days[index]} study hours`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="progress-message">
        🌷 Remember: Your progress is not measured by how fast others
        learn. Focus on becoming a little better every day.
      </div>
    </div>
  );
}

export default Progress;
