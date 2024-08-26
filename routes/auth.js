const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user.js');
const router = express.Router()
const playlist = require('../model/playlistbase.js');
const session = require('express-session');
// Sign-in route
router.get('/signin', (req, res) => {
    res.render('signin');
});

router.post('/signin', async (req, res) => {
    try {
        const { email, username, pass, confirm } = req.body;
        if (pass !== confirm) {
            return res.status(400).send('Passwords do not match');
        }
        const hashedPassword = await bcrypt.hash(pass, 10);
        await User.create({ username, password: hashedPassword });
        req.session.username = username;
        res.render('index', { dis: "show", shows: "display", image: "profile.png", Name: username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const { username, pass } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(pass, user.password)) {
            req.session.username = username;
            res.render('index', { dis: "show", shows: "display", image: "profile.png", Name: username });
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.render('index', { dis: "display", shows: "show", image: "profile.png", Name: '' });
    });
});

// Delete user route
router.get('/delete', async (req, res) => {
    try {
        await User.deleteMany({ username: name });
        console.log("User deleted");
        res.render('index', { dis: "display", shows: "show", image: "profile.png", Name: '' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports=router
