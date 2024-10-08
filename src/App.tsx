import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import { Note, Folder } from './types'
import { PlusCircle, X } from 'lucide-react'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [openNoteIds, setOpenNoteIds] = useState<string[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)

  const addNote = (folderId: string | null) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      folderId: folderId
    }
    setNotes([...notes, newNote])
    openNoteInNewTab(newNote.id)
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    setOpenNoteIds(openNoteIds.filter(noteId => noteId !== id))
    if (activeNoteId === id) {
      setActiveNoteId(openNoteIds.find(noteId => noteId !== id) || null)
    }
  }

  const addFolder = () => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: 'New Folder'
    }
    setFolders([...folders, newFolder])
  }

  const updateFolder = (updatedFolder: Folder) => {
    setFolders(prevFolders => prevFolders.map(folder => 
      folder.id === updatedFolder.id ? updatedFolder : folder
    ))
  }

  const deleteFolder = (id: string) => {
    setFolders(folders.filter(folder => folder.id !== id))
    // Move notes from deleted folder to root
    setNotes(notes.map(note => note.folderId === id ? { ...note, folderId: null } : note))
  }

  const openNoteInNewTab = (id: string) => {
    if (!openNoteIds.includes(id)) {
      setOpenNoteIds([...openNoteIds, id])
    }
    setActiveNoteId(id)
  }

  const closeNote = (id: string) => {
    setOpenNoteIds(openNoteIds.filter(noteId => noteId !== id))
    if (activeNoteId === id) {
      setActiveNoteId(openNoteIds.find(noteId => noteId !== id) || null)
    }
  }

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          notes={notes}
          folders={folders}
          activeNoteId={activeNoteId}
          onSelectNote={openNoteInNewTab}
          onDeleteNote={deleteNote}
          onAddNote={addNote}
          onAddFolder={addFolder}
          onUpdateFolder={updateFolder}
          onDeleteFolder={deleteFolder}
          onOpenInNewTab={openNoteInNewTab}
        />
        <main className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 flex">
            {openNoteIds.map(id => (
              <button
                key={id}
                className={`px-4 py-2 border-r border-gray-200 ${activeNoteId === id ? 'bg-blue-100' : ''}`}
                onClick={() => setActiveNoteId(id)}
              >
                {notes.find(note => note.id === id)?.title}
                <X
                  className="ml-2 inline-block"
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation()
                    closeNote(id)
                  }}
                />
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-4">
            {activeNoteId && (
              <NoteEditor
                note={notes.find(note => note.id === activeNoteId)!}
                onUpdateNote={updateNote}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App