const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    default: 1
  },
  content: {
    type: String,
    default: ''
  },
  font: {
    type: String,
    default: 'Kalam'
  },
  fontSize: {
    type: Number,
    default: 20
  },
  textColor: {
    type: String,
    default: '#1e293b'
  },
  lineSpacing: {
    type: Number,
    default: 1.8
  },
  letterSpacing: {
    type: Number,
    default: 0.5
  },
  paperStyle: {
    type: String,
    enum: ['ruled', 'grid', 'plain', 'notebook', 'dots'],
    default: 'ruled'
  },
  handwritingJitter: {
    type: Number,
    default: 1
  }
}, { _id: true });

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true,
    default: 'Untitled Handwritten Note'
  },
  pages: {
    type: [PageSchema],
    default: () => [{
      pageNumber: 1,
      content: '',
      font: 'Kalam',
      fontSize: 20,
      textColor: '#1e293b',
      lineSpacing: 1.8,
      letterSpacing: 0.5,
      paperStyle: 'ruled',
      handwritingJitter: 1
    }]
  },
  category: {
    type: String,
    default: 'General'
  },
  tags: {
    type: [String],
    default: []
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
