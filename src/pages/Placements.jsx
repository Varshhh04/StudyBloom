
import { useState, useEffect } from "react";
import {
  CheckCircle2, Circle, Target
} from "lucide-react";
import "./Pages.css";

const initialSkills = [
  {
    id: 1,
    name: "DSA & Problem Solving",
    icon: "🧩",
    topics: ["Arrays", "Strings", "Searching & Sorting", "Linked Lists", "Stacks & Queues", "Trees & Heaps", "Hashing", "Dynamic Programming", "Graphs"]
  },
  {
    id: 2,
    name: "Java Programming",
    icon: "☕",
    topics: ["Java Basics", "OOP Concepts", "Inheritance & Polymorphism", "Collections Framework", "Exception Handling", "Multithreading"]
  },
  {
    id: 3,
    name: "DBMS & SQL",
    icon: "🗄️",
    topics: ["DBMS Fundamentals", "ER Diagrams", "Normalization", "SQL Queries", "Joins", "Transactions & ACID", "Indexing"]
  },
  {
    id: 4,
    name: "Operating Systems",
    icon: "💻",
    topics: ["Process Management", "Threads", "CPU Scheduling", "Deadlocks", "Memory Management", "Virtual Memory"]
  },
  {
    id: 5,
    name: "Computer Networks",
    icon: "🌐",
    topics: ["OSI Model", "TCP/IP Model", "IP Addressing", "TCP vs UDP", "Routing", "HTTP & HTTPS", "DNS"]
  },
  {
    id: 6,
    name: "Aptitude",
    icon: "🧠",
    topics: ["Percentages", "Profit & Loss", "Time & Work", "Time Speed & Distance", "Probability", "Logical Reasoning", "Data Interpretation"]
  }
];

function getSavedSkills() {
  try {
    const saved = localStorage.getItem("studybloom-placement-skills");

    if (!saved) {
      return initialSkills.map(skill => ({
        ...skill,
        topics: skill.topics.map(name => ({
          name,
          completed: false
        }))
      }));
    }

    const parsed = JSON.parse(saved);

    return initialSkills.map(defaultSkill => {
      const savedSkill = parsed.find(
        skill => skill.id === defaultSkill.id
      );

      if (!savedSkill) {
        return {
          ...defaultSkill,
          topics: defaultSkill.topics.map(name => ({
            name,
            completed: false
          }))
        };
      }

      return {
        ...defaultSkill,
        topics: defaultSkill.topics.map(defaultTopic => {
          const savedTopic = savedSkill.topics.find(topic =>
            typeof topic === "string"
              ? topic === defaultTopic
              : topic.name === defaultTopic
          );

          return {
            name: defaultTopic,
            completed: typeof savedTopic === "object"
              ? !!savedTopic.completed
              : false
          };
        })
      };
    });
  } catch {
    return initialSkills.map(skill => ({
      ...skill,
      topics: skill.topics.map(name => ({
        name,
        completed: false
      }))
    }));
  }
}

function Placements() {
  const [skills, setSkills] = useState(getSavedSkills);

  useEffect(() => {
    localStorage.setItem(
      "studybloom-placement-skills",
      JSON.stringify(skills)
    );
  }, [skills]);

  const toggleTopic = (skillId, topicIndex) => {
    setSkills(previous =>
      previous.map(skill =>
        skill.id === skillId
          ? {
              ...skill,
              topics: skill.topics.map((topic, index) =>
                index === topicIndex
                  ? { ...topic, completed: !topic.completed }
                  : topic
              )
            }
          : skill
      )
    );
  };

  const total = skills.reduce(
    (sum, skill) => sum + skill.topics.length, 0
  );

  const completed = skills.reduce(
    (sum, skill) =>
      sum + skill.topics.filter(topic => topic.completed).length,
    0
  );

  return (
    <div className="page">
      <h1>Placement Preparation 💻</h1>
      <p className="page-subtitle">
        Build your technical skills one topic at a time.
      </p>

      <div className="academic-summary">
        <div>
          <span>Skill Areas</span>
          <h2>{skills.length}</h2>
        </div>
        <div>
          <span>Topics Completed</span>
          <h2>{completed}/{total}</h2>
        </div>
        <div>
          <span>Preparation Progress</span>
          <h2>{total ? Math.round(completed / total * 100) : 0}%</h2>
        </div>
      </div>

      <div className="subject-grid">
        {skills.map(skill => {
          const done = skill.topics.filter(
            topic => topic.completed
          ).length;

          const percentage = skill.topics.length
            ? Math.round(done / skill.topics.length * 100)
            : 0;

          return (
            <div className="subject-card" key={skill.id}>
              <div className="subject-title">
                <span className="subject-icon">{skill.icon}</span>
                <div>
                  <h3>{skill.name}</h3>
                  <small>
                    {done}/{skill.topics.length} topics completed
                  </small>
                </div>
              </div>

              <div className="progress academic-progress">
                <div style={{ width: `${percentage}%` }} />
              </div>

              <p className="topic-heading">PREPARATION CHECKLIST</p>

              {skill.topics.map((topic, index) => (
                <button
                  className="topic-item"
                  key={index}
                  onClick={() => toggleTopic(skill.id, index)}
                >
                  {topic.completed
                    ? <CheckCircle2 size={17} />
                    : <Circle size={17} />}

                  <span className={topic.completed ? "completed-topic" : ""}>
                    {topic.name}
                  </span>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <div className="page-card assignment-card">
        <h2><Target size={20}/> Placement Preparation Tips</h2>
        <p className="empty-message">
          Practice DSA consistently, revise core CS subjects,
          solve SQL queries, work on projects and attend mock interviews.
          Focus on understanding concepts instead of just completing checklists.
        </p>
      </div>
    </div>
  );
}

export default Placements;
