
import {
  Routes,
  Route,
  NavLink,
  Outlet,
  Link,
  Navigate
} from "react-router-dom";
import React from "react";

import DailyGoals from "./pages/DailyGoals";
import Timetable from "./pages/Timetable";
import Academics from "./pages/Academics";
import Placements from "./pages/Placements";
import Progress from "./pages/Progress";
import QuickNotes from "./pages/QuickNotes";
import SettingsPage from "./pages/Settings";
import FocusTimer from "./pages/FocusTimer";
import StudyTracker from "./pages/StudyTracker";
import Login from "./pages/Login";

import ProtectedRoute from "./context/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabase";

import {
  Home,
  CalendarDays,
  BookOpen,
  Code2,
  ChartNoAxesCombined,
  Settings as SettingsIcon,
  Bell,
  Clock,
  CheckCircle2,
  Flame,
  GraduationCap,
  ArrowUpRight,
  Target,
  StickyNote,
  Timer,
  BookOpenCheck,
  LogOut
} from "lucide-react";

import "./App.css";
import { getStreak } from "./utils/streak";

// Load saved data
function getSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning!";
  if (hour < 17) return "Good afternoon!";

  return "Good evening!";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Shared layout
function Layout() {
  const greeting = getGreeting();
  const formattedDate = getFormattedDate();
  const { user } = useAuth();

  const [theme, setTheme] = React.useState(
    localStorage.getItem("studybloom-theme") || "pastel"
  );

  React.useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("studybloom-theme") || "pastel");
    };

    window.addEventListener("studybloom-theme-change", updateTheme);

    return () => {
      window.removeEventListener("studybloom-theme-change", updateTheme);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className={`app ${theme}-theme`}>

      <aside className="sidebar">
        <h2 className="logo">🌷 StudyBloom</h2>
        <p className="side-label">MENU</p>

        <nav>
          <NavLink to="/" end className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }>
            <Home size={19} /> Dashboard
          </NavLink>

          <NavLink to="/timetable" className="nav-link">
            <CalendarDays size={19} /> Timetable
          </NavLink>

          <NavLink to="/academics" className="nav-link">
            <BookOpen size={19} /> Academics
          </NavLink>

          <NavLink to="/placements" className="nav-link">
            <Code2 size={19} /> Placements
          </NavLink>

          <NavLink to="/daily-goals" className="nav-link">
            <Target size={19} /> Daily Goals
          </NavLink>

          <NavLink to="/quick-notes" className="nav-link">
            <StickyNote size={19} /> Quick Notes
          </NavLink>

          <NavLink to="/progress" className="nav-link">
            <ChartNoAxesCombined size={19} /> Progress
          </NavLink>

          <NavLink to="/focus-timer" className="nav-link">
            <Timer size={19} /> Focus Timer
          </NavLink>

          <NavLink to="/study-tracker" className="nav-link">
            <BookOpenCheck size={19} /> Study Tracker
          </NavLink>
        </nav>

        <NavLink to="/settings" className="nav-link">
          <SettingsIcon size={19} /> Settings
        </NavLink>

        <button className="nav-link logout-button" onClick={handleLogout}>
          <LogOut size={19} /> Logout
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="greeting">YOUR PERSONAL STUDY SPACE</p>
            <h1>{greeting} ✨</h1>

            <p className="dashboard-date">
              <CalendarDays size={16} />
              {formattedDate}
            </p>

            <p className="muted">
              Small steps every day lead to big achievements.
            </p>
          </div>

          <div className="profile">
            <button className="icon-btn">
              <Bell size={20} />
            </button>

            <div className="avatar">
              {user?.email?.charAt(0).toUpperCase() || "V"}
            </div>
          </div>
        </header>

        <Outlet />

        <footer>
          Made with 💗 for your learning journey · StudyBloom
        </footer>
      </main>
    </div>
  );
}

// Dashboard
function Dashboard() {
  const subjects = getSavedData("studybloom-academic-subjects", []);
  const skills = getSavedData("studybloom-placement-skills", []);
  const assignments = getSavedData("studybloom-academic-assignments", []);

  const dailyGoalsData = getSavedData(
    "studybloom-daily-goals",
    { date: "", goals: [] }
  );

  const today = new Date();

  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  const todayGoals =
    dailyGoalsData.date === todayKey ? dailyGoalsData.goals : [];

  const completedDailyGoals = todayGoals.filter(
    goal => goal.completed
  ).length;

  const dailyGoalPercentage = todayGoals.length
    ? Math.round(completedDailyGoals / 4 * 100)
    : 0;

  const studyStreak = getStreak();
  const currentStreak = studyStreak.current;

  const totalAcademicTopics = subjects.reduce(
    (sum, subject) => sum + (subject.topics?.length || 0), 0
  );

  const completedAcademicTopics = subjects.reduce(
    (sum, subject) =>
      sum + (subject.topics || []).filter(topic => topic.completed).length,
    0
  );

  const totalPlacementTopics = skills.reduce(
    (sum, skill) => sum + (skill.topics?.length || 0), 0
  );

  const completedPlacementTopics = skills.reduce(
    (sum, skill) =>
      sum + (skill.topics || []).filter(topic => topic.completed).length,
    0
  );

  const academicProgress = totalAcademicTopics
    ? Math.round(completedAcademicTopics / totalAcademicTopics * 100)
    : 0;

  const placementProgress = totalPlacementTopics
    ? Math.round(completedPlacementTopics / totalPlacementTopics * 100)
    : 0;

  const totalTopics = totalAcademicTopics + totalPlacementTopics;
  const completedTopics =
    completedAcademicTopics + completedPlacementTopics;

  const overallProgress = totalTopics
    ? Math.round(completedTopics / totalTopics * 100)
    : 0;

  const completedAssignments = assignments.filter(
    item => item.completed
  ).length;

  const academicSubjects = subjects.length ? subjects : [
    { name: "AI for Engineers", topics: [] },
    { name: "Applied Cryptography", topics: [] },
    { name: "IoT and Data Analytics", topics: [] },
    { name: "Linear Algebra & Probability Theory", topics: [] },
    { name: "Deep Learning", topics: [] }
  ];

  const placementSkills = skills.length ? skills : [
    { name: "DSA & Problem Solving", topics: [] },
    { name: "Java Programming", topics: [] },
    { name: "DBMS & SQL", topics: [] },
    { name: "Operating Systems", topics: [] },
    { name: "Computer Networks", topics: [] },
    { name: "Aptitude", topics: [] }
  ];

  return (
    <>
      <section className="welcome-card">
        <div>
          <p>YOUR JOURNEY, YOUR PACE 🌸</p>
          <h2>Dream big. Study smart. Bloom brighter.</h2>
          <span>Balance your academics and placement preparation.</span>
        </div>
        <GraduationCap size={75} />
      </section>

      <section className="stats">
        <div className="stat-card pink">
          <span>Academic Subjects</span>
          <BookOpen />
          <h2>{academicSubjects.length}</h2>
          <small>{academicProgress}% academic progress</small>
        </div>

        <div className="stat-card purple">
          <span>Placement Skills</span>
          <Code2 />
          <h2>{placementSkills.length}</h2>
          <small>{placementProgress}% preparation progress</small>
        </div>

        <div className="stat-card peach">
          <span>Assignments Completed</span>
          <CheckCircle2 />
          <h2>{completedAssignments}/{assignments.length}</h2>
          <small>Your academic assignments</small>
        </div>

        <div className="stat-card green">
          <span>Overall Progress</span>
          <Flame />
          <h2>{overallProgress}%</h2>
          <small>{completedTopics} of {totalTopics} topics completed</small>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-heading">
            <h3>📚 Academic Subjects</h3>
            <span>Semester 1</span>
          </div>

          {academicSubjects.map((subject, index) => {
            const topics = subject.topics || [];
            const done = topics.filter(topic => topic.completed).length;
            const percentage = topics.length
              ? Math.round(done / topics.length * 100)
              : 0;

            return (
              <div key={subject.id ?? index}>
                <div className="subject">
                  <span>{subject.name}</span>
                  <b>{percentage}%</b>
                </div>
                <div className="progress">
                  <div style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}

          <Link to="/academics" className="dashboard-link">
            View Academic Planner <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h3>💻 Placement Preparation</h3>
            <ArrowUpRight size={19} />
          </div>

          {placementSkills.map((skill, index) => {
            const topics = skill.topics || [];
            const done = topics.filter(topic => topic.completed).length;
            const percentage = topics.length
              ? Math.round(done / topics.length * 100)
              : 0;

            return (
              <div className="skill" key={skill.id ?? index}>
                <CheckCircle2 size={18} />
                <span>{skill.name}</span>
                <b>{percentage}%</b>
              </div>
            );
          })}

          <Link to="/placements" className="dashboard-link">
            View Placement Planner <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="panel today-panel">
        <div className="panel-heading">
          <h3>🗓️ Today's Focus</h3>
          <span>Build consistency</span>
        </div>

        <div className="focus-item">
          <Clock size={18} />
          <div><b>Morning</b><p>DSA practice – 45 minutes</p></div>
        </div>

        <div className="focus-item">
          <BookOpen size={18} />
          <div><b>Evening</b><p>Revise today's academic subject – 1 hour</p></div>
        </div>

        <div className="focus-item">
          <Code2 size={18} />
          <div><b>Night</b><p>Placement skill practice – 45 minutes</p></div>
        </div>
      </section>

      <section className="panel daily-dashboard-card">
        <div className="panel-heading">
          <h3>🎯 Daily Goals</h3>
          <Link to="/daily-goals" className="dashboard-link">
            View Goals <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="daily-dashboard-content">
          <div>
            <h2>{dailyGoalPercentage}%</h2>
            <p>{completedDailyGoals} of 4 daily goals completed</p>
          </div>
          <div className="daily-dashboard-icon"><Target size={35} /></div>
        </div>

        <div className="progress">
          <div style={{ width: `${dailyGoalPercentage}%` }} />
        </div>
      </section>

      <section className="panel streak-card">
        <div className="streak-content">
          <div>
            <p className="streak-label">YOUR STUDY STREAK</p>
            <h2>🔥 {currentStreak} {currentStreak === 1 ? "Day" : "Days"}</h2>
            <p className="streak-message">
              {currentStreak === 0
                ? "Start studying today to begin your streak!"
                : "Keep going! Consistency creates success."}
            </p>
          </div>
          <div className="streak-icon"><Flame size={42} /></div>
        </div>
      </section>
    </>
  );
}

// Application routes
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">🌷 Loading StudyBloom...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/daily-goals" element={<DailyGoals />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/quick-notes" element={<QuickNotes />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/study-tracker" element={<StudyTracker />} />
          <Route path="/focus-timer" element={<FocusTimer />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
