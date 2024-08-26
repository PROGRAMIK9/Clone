const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./model/user.js');
const playlist = require('./model/playlistbase.js');
const ejs = require("ejs");
const config = require("./config/index.js");
const session = require('express-session');
const auth = require('./routes/auth.js')
const index = require('./routes/index.js')
const play = require('./routes/playlist.js')
const music = require('./routes/song.js')
const searchR= require('./routes/search.js')
const app = express();
const port = config.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Serve static files from the 'public', 'Songs', and 'Thumbnail' directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Songs', express.static(path.join(__dirname, 'Songs')));
app.use('/Thumbnail', express.static(path.join(__dirname, 'Thumbnail')));

app.use(session({
    secret: config.SECRET_ACCESS_TOKEN,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/User")
    .then(() => console.log('Server connected'))
    .catch(err => console.error('Server connection error:', err));

// Global variable to store username
app.use('/',searchR)
app.use('/',auth)
app.use('/',play)
app.use('/',music)
app.use('/',index)

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
