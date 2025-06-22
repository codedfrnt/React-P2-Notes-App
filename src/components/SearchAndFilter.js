import React from 'react';
import { useNotes } from '../contexts/NotesContext';
import { Search, X } from 'lucide-react';

function SearchAndFilter() {
  const { state, dispatch } = useNotes();

  const allTags = Array.from(
    new Set(
      state.notes
        .filter(note => !note.isDeleted)
        .flatMap(note => note.tags)
    )
  ).sort();

  const handleTagToggle = (tag) => {
    const newSelectedTags = state.selectedTags.includes(tag)
      ? state.selectedTags.filter(t => t !== tag)
      : [...state.selectedTags, tag];
    
    dispatch({ type: 'SET_SELECTED_TAGS', payload: newSelectedTags });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search notes by title or content..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {allTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Filter by tags:</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                  state.selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {tag}
                {state.selectedTags.includes(tag) && (
                  <X size={14} className="ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {(state.searchQuery || state.selectedTags.length > 0) && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {state.searchQuery && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Search: "{state.searchQuery}"
            </span>
          )}
          {state.selectedTags.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Tags: {state.selectedTags.length}
            </span>
          )}
          <button
            onClick={() => {
              dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
              dispatch({ type: 'SET_SELECTED_TAGS', payload: [] });
            }}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchAndFilter; 