
import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import "./Pages.css";

function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        setIsRunning(false);

        if (!isBreak) {
          setSessions(previous => previous + 1);
          setIsBreak(true);
          setMinutes(5);
        } else {
          setIsBreak(false);
          setMinutes(25);
        }

        setSeconds(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds, isBreak]);

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  const selectMode = (breakMode) => {
    setIsRunning(false);
    setIsBreak(breakMode);
    setMinutes(breakMode ? 5 : 25);
    setSeconds(0);
  };

  const totalSeconds = minutes * 60 + seconds;
  const initialSeconds = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((initialSeconds - totalSeconds) / initialSeconds) * 100;

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">FOCUS AND GROW</p>
          <h1>Focus Timer ⏳</h1>
          <p>One focused session at a time. You've got this!</p>
        </div>
      </div>

      <section className="panel focus-panel">
        <div className="focus-modes">
          <button
            className={!isBreak ? "selected" : ""}
            onClick={() => selectMode(false)}
          >
            Focus
          </button>

          <button
            className={isBreak ? "selected" : ""}
            onClick={() => selectMode(true)}
          >
            <Coffee size={16} /> Short Break
          </button>
        </div>

        <div className="timer-circle">
          <div
            className="timer-progress"
            style={{ "--progress": `${progress}%` }}
          >
            <div className="timer-inner">
              <h1>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </h1>
              <p>{isBreak ? "TAKE A BREATHER" : "STAY FOCUSED"}</p>
            </div>
          </div>
        </div>

        <div className="timer-actions">
          <button
            className="primary-button"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? "Pause" : "Start Focus"}
          </button>

          <button className="secondary-button" onClick={resetTimer}>
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        <div className="focus-session-count">
          <h3>{sessions}</h3>
          <p>Focus sessions completed</p>
        </div>
      </section>
    </div>
  );
}

export default FocusTimer;
