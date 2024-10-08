import React, { useState, useEffect } from 'react'
import { Note } from '../types'

interface NoteEditorProps {
  note: Note
  onUpdateNote: (note: Note) => void
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdateNote }) => {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
  }, [note])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    onUpdateNote({ ...note, title: e.target.value })
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    onUpdateNote({ ...note, content: e.target.value })
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="w-full text-2xl font-bold p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
        placeholder="Note title"
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
        placeholder="Start typing your note here..."
      />
    </div>
  )
}

export default NoteEditor