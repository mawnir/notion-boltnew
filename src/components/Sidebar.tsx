import React, { useState } from 'react'
import { Note, Folder } from '../types'
import { Trash2, PlusCircle, ExternalLink, FolderPlus, ChevronRight, ChevronDown, Edit2 } from 'lucide-react'

interface SidebarProps {
  notes: Note[]
  folders: Folder[]
  activeNoteId: string | null
  onSelectNote: (id: string) => void
  onDeleteNote: (id: string) => void
  onAddNote: (folderId: string | null) => void
  onAddFolder: () => void
  onUpdateFolder: (folder: Folder) => void
  onDeleteFolder: (id: string) => void
  onOpenInNewTab: (id: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  folders,
  activeNoteId,
  onSelectNote,
  onDeleteNote,
  onAddNote,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder,
  onOpenInNewTab
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const handleFolderRename = (folderId: string, newName: string) => {
    onUpdateFolder({ id: folderId, name: newName })
    setEditingFolderId(null)
  }

  const renderNoteItem = (note: Note) => (
    <li
      key={note.id}
      className={`flex justify-between items-center p-2 mb-2 rounded cursor-pointer ${
        activeNoteId === note.id ? 'bg-blue-100' : 'hover:bg-gray-100'
      }`}
    >
      <span className="truncate flex-grow" onClick={() => onSelectNote(note.id)}>{note.title}</span>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onOpenInNewTab(note.id)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink size={16} />
        </button>
        <button
          onClick={() => onDeleteNote(note.id)}
          className="text-red-500 hover:text-red-600 transition-colors"
          title="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  )

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notes</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => onAddNote(null)}
            className="text-blue-500 hover:text-blue-600 transition-colors"
            title="Add new note"
          >
            <PlusCircle size={24} />
          </button>
          <button
            onClick={onAddFolder}
            className="text-green-500 hover:text-green-600 transition-colors"
            title="Add new folder"
          >
            <FolderPlus size={24} />
          </button>
        </div>
      </div>
      <ul className="overflow-y-auto flex-grow">
        {folders.map(folder => (
          <li key={folder.id} className="mb-2">
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer">
              <div className="flex items-center flex-grow" onClick={() => toggleFolder(folder.id)}>
                {expandedFolders.has(folder.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                {editingFolderId === folder.id ? (
                  <input
                    type="text"
                    className="ml-2 p-1 border rounded"
                    defaultValue={folder.name}
                    onBlur={(e) => handleFolderRename(folder.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleFolderRename(folder.id, e.currentTarget.value)
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="ml-2">{folder.name}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onAddNote(folder.id)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  title="Add note to folder"
                >
                  <PlusCircle size={16} />
                </button>
                <button
                  onClick={() => setEditingFolderId(folder.id)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Rename folder"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDeleteFolder(folder.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title="Delete folder"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {expandedFolders.has(folder.id) && (
              <ul className="ml-4">
                {notes.filter(note => note.folderId === folder.id).map(renderNoteItem)}
              </ul>
            )}
          </li>
        ))}
        {notes.filter(note => note.folderId === null).map(renderNoteItem)}
      </ul>
    </aside>
  )
}

export default Sidebar