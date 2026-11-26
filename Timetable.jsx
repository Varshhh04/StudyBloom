
import { useState } from "react";
import { CalendarDays, BookOpen, Code2, Clock } from "lucide-react";
import "./Pages.css";

const weeklyPlan = [
  {
    day: "Monday",
    academic: "AI for Engineers",
    placement: "DSA + Java",
    task: "Arrays and strings practice"
  },
  {
    day: "Tuesday",
    academic: "Applied Cryptography",
    placement: "DBMS + SQL",
    task: "SQL queries and joins"
  },
  {
    day: "Wednesday",
    academic: "Linear Algebra & Probability Theory",
    placement: "DSA Problem Solving",
    task: "Solve two new problems and revise one"
  },
  {
    day: "Thursday",
    academic: "Deep Learning",
    placement: "Operating Systems + Aptitude",
    task: "OS concepts and aptitude practice"
  },
  {
    day: "Friday",
    academic: "IoT and Data Analytics",
    placement: "Computer Networks + DSA",
    task: "Networking concepts and one DSA problem"
  },
  {
    day: "Saturday",
    academic: "Assignments and Lab Work",
    placement: "Project + Core CS Revision",
    task: "Work on projects and take a mock test"
  },
  {
    day: "Sunday",
    academic: "Weekly Academic Revision",
    placement: "DSA Revision + Mock Test",
    task: "Review mistakes and plan the next week"
  }
];

function Timetable() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const selectedPlan = weeklyPlan.find(
    item => item.day === selectedDay
  );

  return (
    <div className="page">
      <h1>My Weekly Timetable 🗓️</h1>
      <p className="page-subtitle">
        A balanced weekly routine for your M.Tech academics and placements.
      </p>

      <div className="weekly-intro">
        <div>
          <CalendarDays size={28}/>
          <h3>One week at a time!</h3>
          <p>Consistency matters more than studying for long hours.</p>
        </div>
      </div>

      <div className="day-selector">
        {weeklyPlan.map(item => (
          <button
            key={item.day}
            className={selectedDay === item.day ? "day-button selected" : "day-button"}
            onClick={() => setSelectedDay(item.day)}
          >
            {item.day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="page-card selected-day-card">
        <h2>{selectedPlan.day} 🌸</h2>

        <div className="weekly-task academic-task">
          <BookOpen size={23}/>
          <div>
            <small>ACADEMIC FOCUS</small>
            <h3>{selectedPlan.academic}</h3>
            <p>7:00 PM – 8:00 PM</p>
          </div>
        </div>

        <div className="weekly-task placement-task">
          <Code2 size={23}/>
          <div>
            <small>PLACEMENT FOCUS</small>
            <h3>{selectedPlan.placement}</h3>
            <p>8:30 PM – 9:15 PM</p>
          </div>
        </div>

        <div className="weekly-task personal-task">
          <Clock size={23}/>
          <div>
            <small>TODAY'S PRACTICE GOAL</small>
            <h3>{selectedPlan.task}</h3>
            <p>Complete at your own pace</p>
          </div>
        </div>
      </div>

      <div className="page-card weekly-overview">
        <h2>Full Week Overview</h2>

        {weeklyPlan.map(item => (
          <div className="overview-row" key={item.day}>
            <strong>{item.day}</strong>
            <div>
              <span>📚 {item.academic}</span>
              <span>💻 {item.placement}</span>
            </div>
            <button onClick={() => setSelectedDay(item.day)}>
              View day
            </button>
          </div>
        ))}
      </div>

      <p className="timetable-note">
        💗 Your college hours and commute are reserved for classes and travel.
        Adjust study blocks when assignments, labs or exams need extra time.
      </p>
    </div>
  );
}

export default Timetable;
