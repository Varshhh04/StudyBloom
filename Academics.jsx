
import { useState, useEffect } from "react";
import "./Pages.css";

import {
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardList,
  Trash2
} from "lucide-react";

const initialSubjects = [
  {
    id: 1,
    name: "AI for Engineers",
    icon: "🤖",
    color: "pink",
    topics: [
      "Introduction to Artificial Intelligence",
      "Intelligent Agents",
      "Search Algorithms",
      "Knowledge Representation",
      "Machine Learning Basics"
    ]
  },
  {
    id: 2,
    name: "Applied Cryptography",
    icon: "🔐",
    color: "purple",
    topics: [
      "Introduction to Cryptography",
      "Classical Encryption",
      "Symmetric Key Cryptography",
      "Public Key Cryptography",
      "Digital Signatures"
    ]
  },
  {
    id: 3,
    name: "IoT and Data Analytics",
    icon: "📡",
    color: "peach",
    topics: [
      "Introduction to IoT",
      "IoT Architecture",
      "Sensors and Actuators",
      "IoT Communication Protocols",
      "Data Analytics in IoT"
    ]
  },
  {
    id: 4,
    name: "Linear Algebra & Probability Theory",
    icon: "📐",
    color: "green",
    topics: [
      "Matrices and Operations",
      "Determinants",
      "Vector Spaces",
      "Probability Fundamentals",
      "Random Variables"
    ]
  },
  {
    id: 5,
    name: "Deep Learning",
    icon: "🧠",
    color: "pink",
    topics: [
      "Introduction to Neural Networks",
      "Artificial Neurons",
      "Activation Functions",
      "Backpropagation",
      "Gradient-Based Learning"
    ]
  }
];

// Load saved data safely
function getSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function Academics() {
  // Subjects and topic progress
  const [subjects, setSubjects] = useState(() => {
    const saved = getSavedData(
      "studybloom-academic-subjects",
      initialSubjects
    );

    return saved.map(subject => ({
      ...subject,
      topics: subject.topics.map(topic => {
        if (typeof topic === "string") {
          return {
            name: topic,
            completed: false
          };
        }

        const recoveredName =
          topic.name ??
          Object.keys(topic)
            .filter(key => /^\d+$/.test(key))
            .sort((a, b) => Number(a) - Number(b))
            .map(key => topic[key])
            .join("");

        return {
          name: recoveredName,
          completed: !!topic.completed
        };
      })
    }));
  });

  // Assignments
  const [assignments, setAssignments] = useState(() =>
    getSavedData("studybloom-academic-assignments", [])
  );

  // Save subjects
  useEffect(() => {
    localStorage.setItem(
      "studybloom-academic-subjects",
      JSON.stringify(subjects)
    );
  }, [subjects]);

  // Save assignments
  useEffect(() => {
    localStorage.setItem(
      "studybloom-academic-assignments",
      JSON.stringify(assignments)
    );
  }, [assignments]);

  // Toggle topic completion
  const toggleTopic = (subjectId, topicIndex) => {
    setSubjects(previous =>
      previous.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map((topic, index) =>
                index === topicIndex
                  ? {
                      ...topic,
                      completed: !topic.completed
                    }
                  : topic
              )
            }
          : subject
      )
    );
  };

  // Add assignment
  const addAssignment = () => {
    const name = prompt("Enter your assignment name:");

    if (name && name.trim()) {
      setAssignments(previous => [
        ...previous,
        {
          id: Date.now(),
          name: name.trim(),
          completed: false
        }
      ]);
    }
  };

  // Mark assignment complete or incomplete
  const toggleAssignment = id => {
    setAssignments(previous =>
      previous.map(item =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed
            }
          : item
      )
    );
  };

  // Delete assignment
  const deleteAssignment = id => {
    setAssignments(previous =>
      previous.filter(item => item.id !== id)
    );
  };

  // Calculate topic progress
  const totalTopics = subjects.reduce(
    (sum, subject) => sum + subject.topics.length,
    0
  );

  const completedTopics = subjects.reduce(
    (sum, subject) =>
      sum +
      subject.topics.filter(topic => topic.completed).length,
    0
  );

  return (
    <div className="page">

      <h1>My Academic Planner 📚</h1>

      <p className="page-subtitle">
        Organise your M.Tech subjects and keep track of your learning.
      </p>

      {/* Academic Summary */}
      <div className="academic-summary">

        <div>
          <span>Subjects</span>
          <h2>{subjects.length}</h2>
        </div>

        <div>
          <span>Topics Completed</span>
          <h2>
            {completedTopics}/{totalTopics}
          </h2>
        </div>

        <div>
          <span>Overall Progress</span>
          <h2>
            {totalTopics
              ? Math.round(
                  (completedTopics / totalTopics) * 100
                )
              : 0}%
          </h2>
        </div>

      </div>

      {/* Subject Cards */}
      <div className="subject-grid">

        {subjects.map(subject => {
          const completed = subject.topics.filter(
            topic => topic.completed
          ).length;

          const percentage = subject.topics.length
            ? Math.round(
                (completed / subject.topics.length) * 100
              )
            : 0;

          return (
            <div
              className={`subject-card ${subject.color}`}
              key={subject.id}
            >

              <div className="subject-title">

                <span className="subject-icon">
                  {subject.icon}
                </span>

                <div>
                  <h3>{subject.name}</h3>

                  <small>
                    {completed}/{subject.topics.length} topics completed
                  </small>
                </div>

              </div>

              {/* Progress Bar */}
              <div className="progress academic-progress">
                <div
                  style={{
                    width: `${percentage}%`
                  }}
                />
              </div>

              <p className="topic-heading">
                TOPIC CHECKLIST
              </p>

              {/* Topic Checklist */}
              {subject.topics.map((topic, index) => (
                <button
                  className="topic-item"
                  key={index}
                  onClick={() =>
                    toggleTopic(subject.id, index)
                  }
                >
                  {topic.completed ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Circle size={17} />
                  )}

                  <span
                    className={
                      topic.completed
                        ? "completed-topic"
                        : ""
                    }
                  >
                    {topic.name}
                  </span>

                </button>
              ))}

            </div>
          );
        })}

      </div>

      {/* Assignments Section */}
      <div className="page-card assignment-card">

        <div className="panel-heading">

          <h2>
            <ClipboardList size={20} />
            Assignments
          </h2>

          <button
            className="add-button"
            onClick={addAssignment}
          >
            + Add Assignment
          </button>

        </div>

        {assignments.length === 0 ? (

          <p className="empty-message">
            No assignments added yet. Add your first assignment!
          </p>

        ) : (

          assignments.map(item => (
            <div
              className="assignment-item"
              key={item.id}
            >

              {/* Mark Complete */}
              <button
                type="button"
                className="assignment-check"
                onClick={() =>
                  toggleAssignment(item.id)
                }
              >
                {item.completed ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Circle size={18} />
                )}

                <span
                  className={
                    item.completed
                      ? "completed-topic"
                      : ""
                  }
                >
                  {item.name}
                </span>

              </button>

              {/* Delete Assignment */}
              <button
                type="button"
                className="delete-assignment"
                onClick={() =>
                  deleteAssignment(item.id)
                }
                title="Delete assignment"
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 size={17} />
              </button>

            </div>
          ))

        )}

      </div>

    </div>
  );
}

export default Academics;
