import React, { createContext, useContext, useReducer, useEffect } from 'react';

const NotesContext = createContext();

const initialState = {
  notes: [],
  searchQuery: '',
  selectedTags: [],
  currentView: 'all'
};

function notesReducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload ? { ...note, isDeleted: true, updatedAt: new Date().toISOString() } : note
        ),
      };
    case 'RESTORE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload ? { ...note, isDeleted: false, updatedAt: new Date().toISOString() } : note
        ),
      };
    case 'PERMANENT_DELETE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case 'TOGGLE_PIN':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() } : note
        ),
      };
    case 'TOGGLE_ARCHIVE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload ? { ...note, isArchived: !note.isArchived, updatedAt: new Date().toISOString() } : note
        ),
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      dispatch({ type: 'SET_NOTES', payload: parsedNotes });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(state.notes));
  }, [state.notes]);

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
} 