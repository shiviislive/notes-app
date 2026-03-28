const express = require('express');
const authRoutes = require('./routes/auth.routes');
const app = express();
const cookieParser = require('cookie-parser');
const noteRoutes = require('./routes/note.routes');

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Welcome to the Notes App API');
})

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


module.exports = app;