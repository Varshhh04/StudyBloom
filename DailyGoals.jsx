
import { useState, useEffect } from "react";
import { updateStreak } from "../utils/streak";
import {
  BookOpen,
  Code2,
  Target,
  RefreshCw,
  CheckCircle2,
  Circle,
  Flame
} from "lucide-react";

import "./Pages.css";

const initialGoals = [
  {
    id: 1,
    title: "Academic Study",
    description: "Study one M.Tech subject",
    icon: BookOpen
  },
  {
    id: 2,
    title: "DSA Practice",
    description: "Solve at least 2 DSA problems",
    icon: Code2
  },
  {
    id: 3,
    title: "Placement Preparation",
    description: "Practice one placement skill",
    icon: Target
  },
  {
    id: 4,
    title: "Daily Revision",
    description: "Revise what you learned today",
    icon: RefreshCw
  }
];

function getToday() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialGoals() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("studybloom-daily-goals")
    );

    if (saved && saved.date === getToday()) {
      return initialGoals.map(goal => ({
        ...goal,
        completed:
          saved.goals.find(item => item.id === goal.id)
            ?.completed ?? false
      }));
    }
  } catch {
    // Use default goals if saved data is invalid
  }

  return initialGoals.map(goal => ({
    ...goal,
    completed: false
  }));
}

function DailyGoals() {

  const [goals, setGoals] = useState(getInitialGoals);

  useEffect(() => {
    localStorage.setItem(
      "studybloom-daily-goals",
      JSON.stringify({
        date: getToday(),
        goals: goals.map(({ id, completed }) => ({
          id,
          completed
        }))
      })
    );
  }, [goals]);

 const toggleGoal = id => {
  setGoals(previous => {
    const updatedGoals = previous.map(goal =>
      goal.id === id
        ? { ...goal, completed: !goal.completed }
        : goal
    );

    const hasCompletedGoal = updatedGoals.some(
      goal => goal.completed
    );

    if (hasCompletedGoal) {
      updateStreak();
    }

    return updatedGoals;
  });
};

  const completedCount = goals.filter(
    goal => goal.completed
  ).length;

  const percentage = Math.round(
    completedCount / goals.length * 100
  );

  return (
    <div className="page">

      <h1>My Daily Goals 🎯</h1>

      <p className="page-subtitle">
        Small daily actions create big achievements.
      </p>

      <div className="page-card daily-goal-summary">

        <div className="goal-summary-top">

          <div>

            <p>TODAY'S COMPLETION</p>

            <h2>{percentage}%</h2>

            <span>
              {completedCount} of {goals.length} goals completed
            </span>

          </div>

          <Flame size={48} />

        </div>

        <div className="progress">
          <div style={{ width: `${percentage}%` }} />
        </div>

      </div>

      <div className="daily-goal-list">

        {goals.map(goal => {

          const Icon = goal.icon;

          return (

            <button
              type="button"
              key={goal.id}
              className={`daily-goal-item ${
                goal.completed ? "goal-completed" : ""
              }`}
              onClick={() => toggleGoal(goal.id)}
            >

              <Icon size={24} />

              <div className="daily-goal-text">

                <h3>{goal.title}</h3>

                <p>{goal.description}</p>

              </div>

              {goal.completed
                ? <CheckCircle2 size={23} />
                : <Circle size={23} />
              }

            </button>

          );
        })}

      </div>

      {percentage === 100 && (

        <div className="page-card goal-success">
          🎉 Amazing! You completed all your daily goals!
        </div>

      )}

    </div>
  );
}

export default DailyGoals;
