import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import DevoraLoader from '../components/common/DevoraLoader';
import HandwrittenPage from '../components/notes/HandwrittenPage';
import {
  ArrowLeft,
  Save,
  Download,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Undo2,
  Redo2,
  Check,
  Type
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Notes.css';

const FONTS = [
  { name: 'Kalam', label: 'Kalam (Natural Script)' },
  { name: 'Caveat', label: 'Caveat (Fluid Ink)' },
  { name: 'Patrick Hand', label: 'Patrick Hand (Neat Print)' },
  { name: 'Indie Flower', label: 'Indie Flower (Casual)' },
  { name: 'Shadows Into Light', label: 'Shadows Into Light (Quick Note)' },
  { name: 'Dancing Script', label: 'Dancing Script (Calligraphic)' }
];

const INK_COLORS = [
  { name: 'Obsidian Black', value: '#1e293b' },
  { name: 'Royal Blue', value: '#1d4ed8' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Emerald Ink', value: '#047857' },
  { name: 'Violet Pen', value: '#7c3aed' }
];

const PAPER_STYLES = [
  { id: 'ruled', label: 'Ruled Paper' },
  { id: 'grid', label: 'Grid Graph' },
  { id: 'plain', label: 'Plain Ivory' },
  { id: 'notebook', label: 'Spiral Notebook' },
  { id: 'dots', label: 'Dotted Grid' }
];

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Undo / Redo History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Ref to hold the active debounce timer
  const autoSaveTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // 1. Fetch Note Data
  useEffect(() => {
    fetchNote();
    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/notes/${id}`);
      if (res.data?.success && res.data.note) {
        const fetchedNote = res.data.note;
        if (!fetchedNote.pages || fetchedNote.pages.length === 0) {
          fetchedNote.pages = [{
            pageNumber: 1,
            content: '',
            font: 'Kalam',
            fontSize: 20,
            textColor: '#1e293b',
            lineSpacing: 1.8,
            letterSpacing: 0.5,
            paperStyle: 'ruled',
            handwritingJitter: 1
          }];
        }
        setNote(fetchedNote);
        setHistory([JSON.stringify(fetchedNote)]);
        setHistoryIndex(0);
      } else {
        toast.error('Note not found');
        navigate('/notes');
      }
    } catch (err) {
      console.error('Error fetching note:', err);
      toast.error('Failed to load note');
      navigate('/notes');
    } finally {
      setLoading(false);
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 500);
    }
  };

  // 2. Debounced Auto-Save
  const performSave = useCallback(async (noteToSave) => {
    if (!noteToSave || !noteToSave._id) return;
    try {
      setSaveStatus('saving');
      const res = await API.put(`/notes/${noteToSave._id}`, {
        title: noteToSave.title,
        pages: noteToSave.pages,
        category: noteToSave.category,
        tags: noteToSave.tags
      });
      if (res.data?.success) {
        setSaveStatus('saved');
      }
    } catch (err) {
      console.error('Auto-save error:', err);
      setSaveStatus('unsaved');
    }
  }, []);

  const triggerAutoSave = useCallback((updatedNote) => {
    setSaveStatus('unsaved');
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);

    autoSaveTimeoutRef.current = setTimeout(() => {
      performSave(updatedNote);
    }, 850);
  }, [performSave]);

  // 3. Update Page Handler
  const handlePageChange = (index, updatedPage) => {
    if (!note) return;
    const newPages = [...note.pages];
    newPages[index] = updatedPage;

    const newNote = { ...note, pages: newPages };
    setNote(newNote);

    // Push to history
    const serialized = JSON.stringify(newNote);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(serialized);
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    triggerAutoSave(newNote);
  };

  // 4. Update Global Style on Current Page (or All Pages)
  const handleStyleChange = (prop, value, applyToAll = false) => {
    if (!note) return;
    const newPages = note.pages.map((p, idx) => {
      if (applyToAll || idx === currentPageIndex) {
        return { ...p, [prop]: value };
      }
      return p;
    });

    const newNote = { ...note, pages: newPages };
    setNote(newNote);
    triggerAutoSave(newNote);
  };

  // 5. Title Change
  const handleTitleChange = (newTitle) => {
    if (!note) return;
    const newNote = { ...note, title: newTitle };
    setNote(newNote);
    triggerAutoSave(newNote);
  };

  // 6. Multi-page Add / Delete
  const handleAddPage = () => {
    if (!note) return;
    const currentPage = note.pages[currentPageIndex] || {};
    const newPage = {
      pageNumber: note.pages.length + 1,
      content: '',
      font: currentPage.font || 'Kalam',
      fontSize: currentPage.fontSize || 20,
      textColor: currentPage.textColor || '#1e293b',
      lineSpacing: currentPage.lineSpacing || 1.8,
      letterSpacing: currentPage.letterSpacing || 0.5,
      paperStyle: currentPage.paperStyle || 'ruled',
      handwritingJitter: currentPage.handwritingJitter !== undefined ? currentPage.handwritingJitter : 1
    };

    const newPages = [...note.pages, newPage];
    const newNote = { ...note, pages: newPages };
    setNote(newNote);
    setCurrentPageIndex(newPages.length - 1);
    triggerAutoSave(newNote);
    toast.success(`Page ${newPages.length} added!`);
  };

  const handleDeleteCurrentPage = () => {
    if (!note || note.pages.length <= 1) {
      toast.error('Notes must have at least 1 page');
      return;
    }

    const newPages = note.pages.filter((_, idx) => idx !== currentPageIndex).map((p, i) => ({
      ...p,
      pageNumber: i + 1
    }));

    const newNote = { ...note, pages: newPages };
    setNote(newNote);
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    triggerAutoSave(newNote);
    toast.success('Page removed');
  };

  // 7. Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = JSON.parse(history[historyIndex - 1]);
      setNote(prev);
      setHistoryIndex(historyIndex - 1);
      triggerAutoSave(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = JSON.parse(history[historyIndex + 1]);
      setNote(next);
      setHistoryIndex(historyIndex + 1);
      triggerAutoSave(next);
    }
  };

  // 8. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        performSave(note);
        toast.success('Note saved!');
      }
      // Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Shift+Z or Ctrl+Y
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note, performSave, historyIndex, history]);

// Helper to dynamically load external scripts if not present locally
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
};

  // 9. Multi-Page A4 PDF Export Engine
  const handleExportPDF = async () => {
    if (!note || isExportingPdf) return;

    try {
      setIsExportingPdf(true);
      const loadingToast = toast.loading('Generating high-resolution handwritten PDF...');

      // 1. Ensure jsPDF is loaded from window or CDN
      let jsPDFConstructor = window.jspdf?.jsPDF;
      if (!jsPDFConstructor) {
        try {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
          jsPDFConstructor = window.jspdf?.jsPDF;
        } catch (scriptErr) {
          console.warn('Could not load jsPDF from CDN:', scriptErr);
        }
      }

      // 2. Ensure html2canvas is loaded from window or CDN
      let h2c = window.html2canvas;
      if (!h2c) {
        try {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
          h2c = window.html2canvas;
        } catch (scriptErr) {
          console.warn('Could not load html2canvas from CDN:', scriptErr);
        }
      }

      // If jsPDF & html2canvas are available, generate downloadable PDF file
      if (jsPDFConstructor && h2c) {
        const pdf = new jsPDFConstructor({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        const pages = note.pages || [];

        // Temporary container for off-screen clean page rendering
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '800px';
        tempContainer.style.zIndex = '-1000';
        document.body.appendChild(tempContainer);

        for (let i = 0; i < pages.length; i++) {
          const pageData = pages[i];

          const pageEl = document.createElement('div');
          pageEl.className = `a4-paper-canvas paper-${pageData.paperStyle || 'ruled'}`;
          pageEl.style.width = '800px';
          pageEl.style.minHeight = '1130px';
          pageEl.style.boxSizing = 'border-box';
          pageEl.style.fontFamily = `'${pageData.font || 'Kalam'}', cursive, sans-serif`;
          pageEl.style.fontSize = `${pageData.fontSize || 20}px`;
          pageEl.style.color = pageData.textColor || '#1e293b';
          pageEl.style.lineHeight = `${(pageData.fontSize || 20) * (pageData.lineSpacing || 1.8)}px`;
          pageEl.style.letterSpacing = `${pageData.letterSpacing || 0.5}px`;
          pageEl.style.whiteSpace = 'pre-wrap';
          pageEl.style.wordBreak = 'break-word';

          const contentDiv = document.createElement('div');
          contentDiv.innerText = pageData.content || '';
          pageEl.appendChild(contentDiv);

          tempContainer.appendChild(pageEl);

          const canvas = await h2c(pageEl, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#fffdf9'
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);

          if (i > 0) {
            pdf.addPage('a4', 'portrait');
          }

          pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
          tempContainer.removeChild(pageEl);
        }

        document.body.removeChild(tempContainer);

        const fileName = `${(note.title || 'Handwritten_Note').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        pdf.save(fileName);

        toast.dismiss(loadingToast);
        toast.success('PDF exported successfully!');
      } else {
        // High quality native print fallback
        toast.dismiss(loadingToast);
        toast('Opening print dialog for A4 PDF export...', { icon: '🖨️' });
        window.print();
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Opening print fallback for PDF export');
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (loading) {
    return <DevoraLoader message="Opening your handwritten notebook..." />;
  }

  if (!note) return null;

  const currentPage = note.pages[currentPageIndex] || note.pages[0];

  return (
    <div className="notes-page-container" style={{ paddingBottom: '6rem' }}>
      {/* 1. TOP HEADER & METADATA BAR */}
      <div style={styles.topHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
          <button
            onClick={() => navigate('/notes')}
            style={styles.backBtn}
            title="Back to all notes"
          >
            <ArrowLeft size={16} />
          </button>

          <input
            type="text"
            value={note.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            style={styles.titleInput}
            placeholder="Note Title..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Save status badge */}
          <div className={`save-status-pill save-status-${saveStatus}`}>
            {saveStatus === 'saving' ? (
              <>
                <span className="spinner" style={{ width: '10px', height: '10px', borderWidth: '1.5px', borderTopColor: '#b45309' }} />
                <span>Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check size={12} />
                <span>Saved ✓</span>
              </>
            ) : (
              <span>Unsaved changes</span>
            )}
          </div>

          {/* Manual Save Button */}
          <button
            onClick={() => {
              performSave(note);
              toast.success('Saved!');
            }}
            style={styles.actionPillBtn}
            title="Save note (Ctrl+S)"
          >
            <Save size={14} />
            <span className="desktop-only">Save</span>
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            style={styles.exportPdfBtn}
            disabled={isExportingPdf}
            title="Export complete note as high-res A4 PDF"
          >
            <Download size={14} />
            <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. CUSTOMIZATION TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem 0' }}>
        <div className="notes-toolbar-capsule">
          {/* Font Family Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Type size={14} color="#64748b" />
            <select
              value={currentPage.font || 'Kalam'}
              onChange={(e) => handleStyleChange('font', e.target.value)}
              className="notes-tool-select"
              title="Handwriting Font"
            >
              {FONTS.map((f) => (
                <option key={f.name} value={f.name} style={{ fontFamily: `'${f.name}', cursive` }}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="notes-tool-divider" />

          {/* Font Size Selector */}
          <select
            value={currentPage.fontSize || 20}
            onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
            className="notes-tool-select"
            title="Font Size"
          >
            {[16, 18, 20, 22, 24, 28, 32].map((s) => (
              <option key={s} value={s}>{s}px</option>
            ))}
          </select>

          <div className="notes-tool-divider" />

          {/* Ink Color Swatches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {INK_COLORS.map((ink) => (
              <button
                key={ink.value}
                onClick={() => handleStyleChange('textColor', ink.value)}
                className={`notes-color-swatch ${(currentPage.textColor || '#1e293b') === ink.value ? 'active' : ''}`}
                style={{ backgroundColor: ink.value }}
                title={ink.name}
              />
            ))}
          </div>

          <div className="notes-tool-divider" />

          {/* Paper Style Selector */}
          <select
            value={currentPage.paperStyle || 'ruled'}
            onChange={(e) => handleStyleChange('paperStyle', e.target.value)}
            className="notes-tool-select"
            title="Paper Background Style"
          >
            {PAPER_STYLES.map((ps) => (
              <option key={ps.id} value={ps.id}>{ps.label}</option>
            ))}
          </select>

          <div className="notes-tool-divider" />

          {/* Line Spacing */}
          <select
            value={currentPage.lineSpacing || 1.8}
            onChange={(e) => handleStyleChange('lineSpacing', Number(e.target.value))}
            className="notes-tool-select"
            title="Line Spacing"
          >
            <option value={1.4}>Tight (1.4x)</option>
            <option value={1.8}>Normal (1.8x)</option>
            <option value={2.2}>Spaced (2.2x)</option>
          </select>

          <div className="notes-tool-divider" />

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            style={styles.iconToolBtn}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            style={styles.iconToolBtn}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={15} />
          </button>

          <div className="notes-tool-divider" />

          {/* Preview Mode Switcher */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            style={{
              ...styles.iconToolBtn,
              background: previewMode ? '#1f2123' : '#f1f5f9',
              color: previewMode ? '#ffffff' : '#475569'
            }}
            title={previewMode ? 'Switch to Edit Mode' : 'Preview Real Handwritten Organic Jitter'}
          >
            {previewMode ? <Edit3 size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* 3. MULTI-PAGE NAVIGATION BAR */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div className="notes-page-nav-pill">
          <button
            onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            className="notes-nav-btn"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '0 8px', color: '#1f2123' }}>
            Page {currentPageIndex + 1} of {note.pages.length}
          </span>

          <button
            onClick={() => setCurrentPageIndex(Math.min(note.pages.length - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === note.pages.length - 1}
            className="notes-nav-btn"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <button
          onClick={handleAddPage}
          style={styles.actionPillBtn}
          title="Add New A4 Page"
        >
          <Plus size={14} />
          <span>Add Page</span>
        </button>

        {note.pages.length > 1 && (
          <button
            onClick={handleDeleteCurrentPage}
            style={{ ...styles.actionPillBtn, color: '#ef4444' }}
            title="Delete this page"
          >
            <Trash2 size={14} />
            <span>Delete Page</span>
          </button>
        )}
      </div>

      {/* 4. A4 NOTEBOOK PAPER CANVAS */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <HandwrittenPage
          page={currentPage}
          pageIndex={currentPageIndex}
          readOnly={previewMode}
          onChange={handlePageChange}
        />
      </div>

      {/* 5. MULTI-PAGE THUMBNAILS BOTTOM DOCK */}
      {note.pages.length > 1 && (
        <div style={styles.thumbnailDock}>
          {note.pages.map((p, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentPageIndex(idx)}
              style={{
                ...styles.thumbCard,
                ...(currentPageIndex === idx ? styles.thumbCardActive : {})
              }}
              title={`Switch to Page ${idx + 1}`}
            >
              <div
                className={`paper-${p.paperStyle || 'ruled'}`}
                style={styles.thumbMiniPaper}
              >
                <div style={{ fontSize: '6px', lineHeight: '8px', color: p.textColor, fontFamily: `'${p.font}', cursive` }}>
                  {p.content ? p.content.slice(0, 40) : 'Page ' + (idx + 1)}
                </div>
              </div>
              <span style={styles.thumbLabel}>Page {idx + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  topHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    borderRadius: '24px',
    padding: '0.85rem 1.25rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
  },
  backBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    color: '#1f2123',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s ease'
  },
  titleInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: "'Playpen Sans', cursive, sans-serif",
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#1f2123',
    width: '100%',
    letterSpacing: '-0.02em'
  },
  actionPillBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.1rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    borderRadius: '30px',
    fontFamily: "'Playpen Sans', cursive, sans-serif",
    fontSize: '0.84rem',
    fontWeight: 700,
    color: '#1f2123',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  exportPdfBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.55rem 1.25rem',
    background: '#1f2123',
    border: 'none',
    borderRadius: '30px',
    fontFamily: "'Playpen Sans', cursive, sans-serif",
    fontSize: '0.86rem',
    fontWeight: 800,
    color: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.15s ease'
  },
  iconToolBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    background: '#f6f5f1',
    color: '#1f2123',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  thumbnailDock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.85rem',
    marginTop: '2rem',
    flexWrap: 'wrap'
  },
  thumbCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '8px',
    border: '2px solid transparent',
    transition: 'all 0.15s ease'
  },
  thumbCardActive: {
    borderColor: '#1f2123',
    transform: 'scale(1.05)'
  },
  thumbMiniPaper: {
    width: '45px',
    height: '60px',
    borderRadius: '4px',
    overflow: 'hidden',
    padding: '4px',
    boxSizing: 'border-box',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  thumbLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#71757c',
    fontFamily: "'Playpen Sans', cursive, sans-serif"
  }
};
