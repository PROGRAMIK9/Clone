const express = require('express');
const path = require('path');
const fs = require('fs');
const User = require('../model/user.js');
const playlist = require('../model/playlistbase.js');
const router = express.Router()
const session = require('express-session');

router.get('/api/users/guest', (req, res) => {
    const songsD = path.join(__dirname, '../Songs');
    fs.readdir(songsD, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Unable to scan directory');
        }
        const subfolders = files
            .filter(file => file.isDirectory())
            .map(file => file.name);
        res.json(subfolders);
    });
});

router.get('/api/users/:user',async(req,res)=>{
    try {
        const songsDir = await playlist.find({ username: req.params.user});
        if (!songsDir) {
            return res.status(404).send('Playlist not found');
        }
        let music=[]
        songsDir.forEach(element => {
            music.push(element.playlist)
        })
        res.json(music);
    } catch (err) {
        res.json(err)
    }
})

// Endpoint to get list of MP3 files
router.get('/api/users/guest/:slug', (req, res) => {
    const songsDir = path.join(__dirname, `../Songs/${req.params.slug}`);
    fs.readdir(songsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const mp3Files = files.filter(file => file.endsWith('.mp3'));
        res.json(mp3Files);
    });
});

// Endpoint to get list of JPEG thumbnails
router.get('/api/thumbnails/playlist', (req, res) => {
    const thumbsDir = path.join(__dirname, '../Thumbnail/Playlists');
    fs.readdir(thumbsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const jpegFiles = files.filter(file => file.endsWith('.jpg'));
        res.json(jpegFiles);
    });
});

router.get('/api/thumbnails/songs', (req, res) => {
    const thumbsDir = path.join(__dirname, '../Thumbnail/Songs');
    fs.readdir(thumbsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const jpegFiles = files.filter(file => file.endsWith('.jpeg'));
        res.json(jpegFiles);
    });
});

// Endpoint to get playlist
router.get('/api/users/:user/:slug', async (req, res, next) => {
    try {
        if(req.params.user=="guest"){
            
        }
        const songsDir = await playlist.findOne({ username: req.params.user, playlist: req.params.slug });
        if (!songsDir) {
            return res.status(404).send('Playlist not found');
        }
        res.json(songsDir.SongList);
    } catch (err) {
        res.json(err)
    }
});

module.exports=router

