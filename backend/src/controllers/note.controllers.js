const Note = require('../models/notes.models');

async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      user: req.user.id
    });

    res.status(201).json({
      message: "Note created",
      note
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyNotes(req, res) {
  try {
    const notes = await Note.find({ user: req.user.id });

    res.status(200).json({
      notes
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
 
    if (note.user.toString() !== req.user.id.toString()) {
  return res.status(403).json({ message: "Unauthorized" });
}

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    await note.save();

    res.status(200).json({
      message: "Note updated",
      note
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note deleted"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllNotes(req, res) {
  try {
    const notes = await Note.find().populate('user', 'email');

    res.status(200).json({
      notes
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createNote,
  getMyNotes,
  updateNote,
  deleteNote,
  getAllNotes
};