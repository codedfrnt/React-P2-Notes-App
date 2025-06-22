import React, { useMemo } from 'react';
import { useNotes } from '../contexts/NotesContext';
import NoteCard from './NoteCard';

function NotesGrid({ onEditNote }) {
  const { state, dispatch } = useNotes();

  const filteredNotes = useMemo(() => {
    let notes = state.notes;

    switch (state.currentView) {
      case 'pinned':
        notes = notes.filter(note => note.isPinned && !note.isDeleted && !note.isArchived);
        break;
      case 'archived':
        notes = notes.filter(note => note.isArchived && !note.isDeleted);
        break;
      case 'trash':
        notes = notes.filter(note => note.isDeleted);
        break;
      default:
        notes = notes.filter(note => !note.isDeleted && !note.isArchived);
        break;
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      notes = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    if (state.selectedTags.length > 0) {
      notes = notes.filter(note =>
        state.selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    return notes.sort((a, b) => {
      if (state.currentView !== 'pinned') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
      }
      
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [state.notes, state.currentView, state.searchQuery, state.selectedTags]);

  const handleTogglePin = (id) => {
    dispatch({ type: 'TOGGLE_PIN', payload: id });
  };

  const handleToggleArchive = (id) => {
    dispatch({ type: 'TOGGLE_ARCHIVE', payload: id });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  const handleRestore = (id) => {
    dispatch({ type: 'RESTORE_NOTE', payload: id });
  };

  const handlePermanentDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
      dispatch({ type: 'PERMANENT_DELETE', payload: id });
    }
  };

  const getEmptyStateMessage = () => {
    switch (state.currentView) {
      case 'pinned':
        return 'No pinned notes yet. Pin important notes to keep them easily accessible.';
      case 'archived':
        return 'No archived notes. Archive notes you want to keep but don\'t need frequently.';
      case 'trash':
        return 'Trash is empty. Deleted notes will appear here.';
      default:
        if (state.searchQuery || state.selectedTags.length > 0) {
          return 'No notes match your current filters. Try adjusting your search or tag filters.';
        }
        return 'No notes yet. Create your first note to get started!';
    }
  };

  if (filteredNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">
            {getEmptyStateMessage()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {filteredNotes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEditNote}
          onTogglePin={handleTogglePin}
          onToggleArchive={handleToggleArchive}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
        />
      ))}
    </div>
  );
}

export default NotesGrid; 