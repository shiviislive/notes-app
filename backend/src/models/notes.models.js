const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },

  content: {
    type: String,
    required: [true, 'Content is required']
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true
});

noteSchema.index({ user: 1 });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;