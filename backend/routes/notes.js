const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// ── 1. Get All Notes for Current User (with Search & Filter) ───────────────
// GET /api/notes
router.get('/', auth, async (req, res) => {
  try {
    const { q, category, sort = 'updatedAt' } = req.query;

    const query = { userId: req.user._id };

    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { 'pages.content': searchRegex },
        { tags: searchRegex },
        { category: searchRegex }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const sortOptions = {};
    if (sort === 'title') {
      sortOptions.title = 1;
    } else if (sort === 'createdAt') {
      sortOptions.createdAt = -1;
    } else {
      sortOptions.updatedAt = -1;
    }

    const notes = await Note.find(query)
      .sort(sortOptions)
      .lean();

    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (err) {
    console.error('Fetch notes error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve handwritten notes' });
  }
});

// ── 2. Get Single Note by ID ───────────────────────────────────────────────
// GET /api/notes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({
      success: true,
      note
    });
  } catch (err) {
    console.error('Fetch note error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve note' });
  }
});

// ── 3. Create a New Note ───────────────────────────────────────────────────
// POST /api/notes
router.post('/', auth, async (req, res) => {
  try {
    const {
      title = 'Untitled Handwritten Note',
      pages,
      category = 'General',
      tags = [],
      isPinned = false
    } = req.body;

    const initialPages = Array.isArray(pages) && pages.length > 0
      ? pages.map((p, idx) => ({
          pageNumber: p.pageNumber || idx + 1,
          content: p.content || '',
          font: p.font || 'Kalam',
          fontSize: p.fontSize || 20,
          textColor: p.textColor || '#1e293b',
          lineSpacing: p.lineSpacing || 1.8,
          letterSpacing: p.letterSpacing || 0.5,
          paperStyle: p.paperStyle || 'ruled',
          handwritingJitter: p.handwritingJitter !== undefined ? p.handwritingJitter : 1
        }))
      : [{
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

    const note = await Note.create({
      userId: req.user._id,
      title: title.trim() || 'Untitled Handwritten Note',
      pages: initialPages,
      category,
      tags,
      isPinned
    });

    res.status(201).json({
      success: true,
      note
    });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create handwritten note' });
  }
});

// ── 4. Update / Auto-Save Note ─────────────────────────────────────────────
// PUT /api/notes/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, pages, category, tags, isPinned } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim() || 'Untitled Handwritten Note';
    if (pages !== undefined && Array.isArray(pages)) {
      updateFields.pages = pages.map((p, idx) => ({
        pageNumber: p.pageNumber || idx + 1,
        content: p.content !== undefined ? p.content : '',
        font: p.font || 'Kalam',
        fontSize: p.fontSize || 20,
        textColor: p.textColor || '#1e293b',
        lineSpacing: p.lineSpacing || 1.8,
        letterSpacing: p.letterSpacing || 0.5,
        paperStyle: p.paperStyle || 'ruled',
        handwritingJitter: p.handwritingJitter !== undefined ? p.handwritingJitter : 1
      }));
    }
    if (category !== undefined) updateFields.category = category;
    if (tags !== undefined) updateFields.tags = tags;
    if (isPinned !== undefined) updateFields.isPinned = isPinned;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    res.json({
      success: true,
      note
    });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ success: false, message: 'Failed to save note' });
  }
});

// ── 5. Duplicate Note ───────────────────────────────────────────────────────
// POST /api/notes/:id/duplicate
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const original = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!original) {
      return res.status(404).json({ success: false, message: 'Original note not found' });
    }

    const duplicated = await Note.create({
      userId: req.user._id,
      title: `${original.title} (Copy)`,
      pages: original.pages.map(p => ({
        pageNumber: p.pageNumber,
        content: p.content,
        font: p.font,
        fontSize: p.fontSize,
        textColor: p.textColor,
        lineSpacing: p.lineSpacing,
        letterSpacing: p.letterSpacing,
        paperStyle: p.paperStyle,
        handwritingJitter: p.handwritingJitter
      })),
      category: original.category,
      tags: [...original.tags],
      isPinned: false
    });

    res.status(201).json({
      success: true,
      note: duplicated
    });
  } catch (err) {
    console.error('Duplicate note error:', err);
    res.status(500).json({ success: false, message: 'Failed to duplicate note' });
  }
});

// ── 6. Delete Note ─────────────────────────────────────────────────────────
// DELETE /api/notes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Handwritten note deleted successfully',
      noteId: req.params.id
    });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete note' });
  }
});

module.exports = router;
