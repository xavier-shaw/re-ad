import { useState } from 'react'

interface NotesProps {
  className: string;
}

function Notes({ className }: NotesProps) {
  const [notes, setNotes] = useState("")
  
  return (
    <div className={ className }>
      <input
        type="text"
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
    </div>
  )
}

export default Notes