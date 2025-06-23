import React from 'react';
import { useNotes } from '../contexts/NotesContext';
import { Archive, Pin, Trash2, BookOpen } from 'lucide-react';

function Sidebar() {
  const { state, dispatch } = useNotes();

  const menuItems = [
    { id: 'all', label: 'All Notes', icon: BookOpen, count: state.notes.filter(n => !n.isDeleted && !n.isArchived).length },
    { id: 'pinned', label: 'Pinned', icon: Pin, count: state.notes.filter(n => n.isPinned && !n.isDeleted && !n.isArchived).length },
    { id: 'archived', label: 'Archived', icon: Archive, count: state.notes.filter(n => n.isArchived && !n.isDeleted).length },
    { id: 'trash', label: 'Trash', icon: Trash2, count: state.notes.filter(n => n.isDeleted).length },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Notes App</h1>
        <p className="text-gray-600 text-sm">Manage your notes efficiently</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: item.id })}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                state.currentView === item.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                state.currentView === item.id
                  ? 'bg-blue-200 text-blue-700'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar; 