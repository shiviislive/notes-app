const express = require('express');
const router = express.Router();

const {
  createNote,
  getMyNotes,
  updateNote,
  deleteNote,
  getAllNotes
} = require('../controllers/note.controllers');

const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createNote);

router.get('/', authMiddleware, getMyNotes);

router.put('/:id', authMiddleware, updateNote);

router.delete('/:id', authMiddleware, deleteNote);

router.get('/all', authMiddleware, isAdmin, getAllNotes);

module.exports = router;