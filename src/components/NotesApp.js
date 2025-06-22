import React, { useState } from 'react';
import { NotesProvider, useNotes } from '../contexts/NotesContext';
import Sidebar from './Sidebar';
import SearchAndFilter from './SearchAndFilter';
import NotesGrid from './NotesGrid';
import NoteModal from './NoteModal';
import { Plus } from 'lucide-react';

function NotesAppContent() {
  const { dispatch } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (noteData) => {
    const now = new Date().toISOString();
    
    if (editingNote) {
      const updatedNote = {
        ...editingNote,
        ...noteData,
        updatedAt: now,
      };
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        ...noteData,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_NOTE', payload: newNote });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
              <p className="text-gray-600">Organize your thoughts and ideas</p>
            </div>
            <button
              onClick={handleCreateNote}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>
        </div>

        <SearchAndFilter />
        
        <div className="flex-1 overflow-y-auto">
          <NotesGrid onEditNote={handleEditNote} />
        </div>
      </div>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        note={editingNote}
      />
    </div>
  );
}

function NotesApp() {
  return (
    <NotesProvider>
      <NotesAppContent />
    </NotesProvider>
  );
}

export default NotesApp; 