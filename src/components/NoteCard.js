import React from 'react';
import { Pin, Archive, Trash2, Edit } from 'lucide-react';

function NoteCard({
  note,
  onEdit,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onRestore,
  onPermanentDelete,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    return content.length > maxLength ? content.slice(0, maxLength) + '...' : content;
  };

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
      note.isPinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(note.updatedAt)}
          </p>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          {note.isPinned && (
            <Pin size={16} className="text-yellow-600 fill-current" />
          )}
          {note.isArchived && (
            <Archive size={16} className="text-gray-500" />
          )}
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
        {truncateContent(note.content)}
      </p>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(note)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Edit size={16} />
          <span className="text-sm">Edit</span>
        </button>

        <div className="flex items-center space-x-2">
          {note.isDeleted ? (
            <>
              <button
                onClick={() => onRestore(note.id)}
                className="text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                Restore
              </button>
              <button
                onClick={() => onPermanentDelete(note.id)}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Delete Forever
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onTogglePin(note.id)}
                className={`p-1 rounded transition-colors ${
                  note.isPinned
                    ? 'text-yellow-600 hover:text-yellow-800'
                    : 'text-gray-400 hover:text-yellow-600'
                }`}
              >
                <Pin size={16} className={note.isPinned ? 'fill-current' : ''} />
              </button>
              
              <button
                onClick={() => onToggleArchive(note.id)}
                className={`p-1 rounded transition-colors ${
                  note.isArchived
                    ? 'text-gray-600 hover:text-gray-800'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Archive size={16} />
              </button>
              
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteCard; 