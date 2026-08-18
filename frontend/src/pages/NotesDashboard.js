import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import HandwrittenPage from '../components/notes/HandwrittenPage';
import {
  Plus,
  Search,
  Copy,
  Trash2,
  Calendar,
  FileText,
  Layers,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Notes.css';

const getInitialNotesCache = () => {
  try {
    const cached = sessionStorage.getItem('devora_notes_cache');
    if (cached) return JSON.parse(cached);
  } catch (e) {}
  return [];
};

export default function NotesDashboard() {
  const navigate = useNavigate();
  const cachedNotes = getInitialNotesCache();
  const [notes, setNotes] = useState(cachedNotes);
  const [loading, setLoading] = useState(cachedNotes.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deleteModalNote, setDeleteModalNote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      if (res.data?.success) {
        setNotes(res.data.notes || []);
        sessionStorage.setItem('devora_notes_cache', JSON.stringify(res.data.notes || []));
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewNote = async () => {
    try {
      const payload = {
        title: 'Untitled Handwritten Note',
        category: 'General',
        pages: [{
          pageNumber: 1,
          content: '',
          font: 'Kalam',
          fontSize: 20,
          textColor: '#1e293b',
          lineSpacing: 1.8,
          letterSpacing: 0.5,
          paperStyle: 'ruled'
        }]
      };

      const res = await API.post('/notes', payload);
      if (res.data?.success && res.data.note?._id) {
        toast.success('New note created!');
        navigate(`/notes/${res.data.note._id}`);
      }
    } catch (err) {
      console.error('Error creating note:', err);
      toast.error('Failed to create new note');
    }
  };

  const handleDuplicateNote = async (e, noteId) => {
    e.stopPropagation();
    try {
      const res = await API.post(`/notes/${noteId}/duplicate`);
      if (res.data?.success) {
        toast.success('Note duplicated');
        fetchNotes();
      }
    } catch (err) {
      console.error('Error duplicating note:', err);
      toast.error('Failed to duplicate note');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalNote) return;
    try {
      setIsDeleting(true);
      await API.delete(`/notes/${deleteModalNote._id}`);
      toast.success('Note deleted');
      setNotes((prev) => prev.filter((n) => n._id !== deleteModalNote._id));
      setDeleteModalNote(null);
    } catch (err) {
      console.error('Error deleting note:', err);
      toast.error('Failed to delete note');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter notes by search query and category
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.pages || []).some((p) => p.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || n.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'System Design', 'Algorithms', 'Interview Prep', 'General'];

  return (
    <div className="notes-page-container">
      {/* 1. Header Banner & Quick Actions */}
      <div style={styles.topHeaderRow}>
        <div>
          <h1 style={styles.mainTitle}>Handwritten Notes</h1>
          <p style={styles.subTitle}>
            Type with natural handwriting aesthetics on realistic ruled, grid, and notebook paper. Export multi-page A4 PDFs with true ink styling.
          </p>
        </div>

        <button
          onClick={() => handleCreateNewNote()}
          style={styles.createNoteBtn}
          title="Create a new blank handwritten note"
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div style={styles.filterRow}>
        <div style={styles.searchWrapper}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={styles.categoryPillsWrapper}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.categoryPill,
                ...(selectedCategory === cat ? styles.categoryPillActive : {})
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Notes Grid View */}
      {loading && filteredNotes.length === 0 ? (
        <div className="notes-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="note-card-item" style={{ opacity: 0.5, pointerEvents: 'none' }}>
              <div className="note-card-preview-thumb paper-ruled" style={{ height: '130px' }} />
              <div style={{ height: '18px', width: '60%', background: '#f6f5f1', borderRadius: '8px', marginBottom: '8px' }} />
              <div style={{ height: '14px', width: '40%', background: '#f6f5f1', borderRadius: '8px' }} />
            </div>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div style={styles.emptyStateContainer}>
          <div style={styles.emptyIconBox}>
            <FileText size={32} color="#64748b" />
          </div>
          <h3 style={styles.emptyTitle}>
            {searchQuery ? 'No notes matched your search' : 'No handwritten notes yet'}
          </h3>
          <p style={styles.emptyText}>
            {searchQuery
              ? 'Try searching with different keywords or clear the search filter.'
              : 'Create your first handwritten note with realistic ink styling, ruled paper, and multi-page A4 PDF export.'}
          </p>
          <button
            onClick={() => handleCreateNewNote()}
            style={styles.createNoteBtn}
          >
            <Plus size={18} />
            <span>Create Your First Note</span>
          </button>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => {
            const firstPage = note.pages?.[0] || {
              font: 'Kalam',
              fontSize: 18,
              textColor: '#1e293b',
              lineSpacing: 1.8,
              letterSpacing: 0.5,
              paperStyle: 'ruled',
              content: 'Empty note'
            };
            const pageCount = note.pages?.length || 1;
            const updatedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={note._id}
                className="note-card-item"
                onClick={() => navigate(`/notes/${note._id}`)}
              >
                {/* Note Thumbnail Preview */}
                <div
                  className={`note-card-preview-thumb paper-${firstPage.paperStyle || 'ruled'}`}
                  style={{
                    fontFamily: `'${firstPage.font || 'Kalam'}', cursive, sans-serif`,
                    fontSize: '11px',
                    lineHeight: '18px',
                    color: firstPage.textColor || '#1e293b'
                  }}
                >
                  {firstPage.content ? (
                    firstPage.content.slice(0, 160) + (firstPage.content.length > 160 ? '...' : '')
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Blank page...</span>
                  )}
                </div>

                {/* Card Meta & Title */}
                <div>
                  <div style={styles.cardHeaderRow}>
                    <h3 style={styles.cardTitle}>{note.title}</h3>
                  </div>

                  <div style={styles.cardBadgesRow}>
                    <span style={styles.cardBadge}>
                      <Layers size={11} />
                      <span>{pageCount} {pageCount === 1 ? 'Page' : 'Pages'}</span>
                    </span>
                    <span style={{ ...styles.cardBadge, textTransform: 'capitalize' }}>
                      {firstPage.paperStyle || 'Ruled'} Paper
                    </span>
                    <span style={styles.cardBadge}>
                      {firstPage.font || 'Kalam'}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div style={styles.cardFooter}>
                  <div style={styles.cardDate}>
                    <Calendar size={12} />
                    <span>{updatedDate}</span>
                  </div>

                  <div style={styles.cardActionButtons}>
                    <button
                      onClick={(e) => handleDuplicateNote(e, note._id)}
                      style={styles.cardActionIconBtn}
                      title="Duplicate note"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModalNote(note);
                      }}
                      style={{ ...styles.cardActionIconBtn, color: '#ef4444' }}
                      title="Delete note"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deleteModalNote && (
        <div
          style={styles.modalBackdrop}
          onClick={() => {
            if (!isDeleting) setDeleteModalNote(null);
          }}
        >
          <div
            style={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalIconBox}>
              <Trash2 size={24} color="#ef4444" />
            </div>
            <h3 style={styles.modalTitle}>Delete Note?</h3>
            <p style={styles.modalDesc}>
              Are you sure you want to delete <strong>"{deleteModalNote.title}"</strong>? This action cannot be undone.
            </p>
            <div style={styles.modalActionsRow}>
              <button
                onClick={() => setDeleteModalNote(null)}
                style={styles.modalCancelBtn}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={styles.modalDeleteBtn}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  topHeaderRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1.5rem',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.04em'
  },
  subTitle: {
    fontSize: '1rem',
    color: '#5b5e64',
    margin: 0,
    maxWidth: '600px',
    lineHeight: 1.6
  },
  createNoteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.85rem 1.75rem',
    background: '#1f2123',
    color: '#f5c842',
    border: 'none',
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 8px 20px -5px rgba(26, 25, 20, 0.3)',
    transition: 'transform 0.2s ease'
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '2rem'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    borderRadius: '30px',
    padding: '0.75rem 1.25rem',
    flex: 1
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.95rem',
    color: '#1f2123',
    width: '100%',
      },
  categoryPillsWrapper: {
    display: 'flex',
    gap: '0.5rem'
  },
  categoryPill: {
    border: '1px solid rgba(0, 0, 0, 0.07)',
    background: 'transparent',
    padding: '8px 20px',
    borderRadius: '30px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#5b5e64',
    cursor: 'pointer'
  },
  categoryPillActive: {
    background: '#f5c842',
    borderColor: '#f5c842',
    color: '#1f2123'
  },
  emptyStateContainer: {
    textAlign: 'center',
    padding: '5rem 2rem',
    border: '1.5px dashed rgba(0, 0, 0, 0.1)',
    borderRadius: '24px'
  },
  emptyIconBox: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#f6f5f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
    color: '#d97706'
  },
  emptyTitle: {
        fontSize: '1.5rem',
    color: '#1f2123',
    marginBottom: '0.5rem'
  },
  emptyText: {
    color: '#71757c',
    maxWidth: '500px',
    margin: '0 auto 2rem auto'
  },
  cardHeaderRow: {
    marginBottom: '0.75rem'
  },
  cardTitle: {
        fontSize: '1.2rem',
    color: '#1f2123',
    margin: 0
  },
  cardBadgesRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  cardBadge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    background: '#f6f5f1',
    padding: '4px 10px',
    borderRadius: '20px',
    color: '#5b5e64'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #f6f5f1'
  },
  cardDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: '#8e9298'
  },
  cardActionButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  cardActionIconBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(26, 25, 20, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center'
  },
  modalIconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#fee2e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
    color: '#ef4444'
  },
  modalTitle: {
        fontSize: '1.5rem',
    color: '#1f2123',
    marginBottom: '0.75rem'
  },
  modalDesc: {
    color: '#5b5e64',
    marginBottom: '2rem'
  },
  modalActionsRow: {
    display: 'flex',
    gap: '0.75rem'
  },
  modalCancelBtn: {
    flex: 1,
    padding: '0.85rem',
    borderRadius: '30px',
    background: '#f6f5f1',
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer'
  },
  modalDeleteBtn: {
    flex: 1,
    padding: '0.85rem',
    borderRadius: '30px',
    background: '#ef4444',
    color: '#ffffff',
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer'
  }
};
