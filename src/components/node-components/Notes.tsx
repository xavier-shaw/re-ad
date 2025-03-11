import { useState } from "react";

interface NotesProps {
  className: string;
}

function Notes({ className }: NotesProps) {
  const [notes, setNotes] = useState("");

  return (
    <div className={`notes-container ${className}`}>
      <h3 className="notes-title">Your Notes</h3>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
        className="notes-input"
      />
    </div>
  );
}

export default Notes;
