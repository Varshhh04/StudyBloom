
import { useEffect, useState } from "react";
import { StickyNote, Plus, Trash2, Pin } from "lucide-react";
import "./Pages.css";

const STORAGE_KEY = "studybloom-quick-notes";

function QuickNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now(),
      text: noteText.trim(),
      date: new Date().toLocaleDateString()
    };

    setNotes(previous => [newNote, ...previous]);
    setNoteText("");
  };

  const deleteNote = id => {
    setNotes(previous => previous.filter(note => note.id !== id));
  };

  return (
    <div className="page quick-notes-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">YOUR PERSONAL SPACE</p>
          <h1>Quick Notes 📝</h1>
          <p className="page-subtitle">
            Save important ideas, reminders and study points.
          </p>
        </div>

        <div className="notes-count">
          <StickyNote size={21} />
          <span>{notes.length} Notes</span>
        </div>
      </div>

      <section className="page-card notes-input-panel">
        <h2><Plus size={20} /> Create a New Note</h2>

        <textarea
          className="quick-note-input"
          value={noteText}
          onChange={event => setNoteText(event.target.value)}
          placeholder="Write your study notes, important concepts or reminders here..."
          rows={5}
        />

        <div className="note-form-footer">
          <span>{noteText.length} characters</span>

          <button
            className="primary-button"
            onClick={addNote}
            disabled={!noteText.trim()}
          >
            <Plus size={17} />
            Add Note
          </button>
        </div>
      </section>

      <div className="notes-heading">
        <div>
          <h2><Pin size={19} /> Your Saved Notes</h2>
          <p>All your important thoughts in one place.</p>
        </div>

        <span>{notes.length} saved</span>
      </div>

      {notes.length === 0 ? (
        <div className="page-card empty-notes">
          <StickyNote size={42} />
          <h2>No notes yet!</h2>
          <p>Your saved notes will appear here.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <article className="note-card" key={note.id}>
              <div className="note-card-top">
                <span className="note-icon">
                  <StickyNote size={19} />
                </span>

                <button
                  className="delete-note"
                  onClick={() => deleteNote(note.id)}
                  aria-label="Delete note"
                  title="Delete note"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <p>{note.text}</p>
              <span className="note-date">{note.date}</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuickNotes;
