const express = require('express');
const playlist = require('../model/playlistbase.js');
const ejs = require("ejs");
const router = express.Router()
const session = require('express-session');

// Create playlist route
router.get('/create', (req, res) => {
    if(!req.session.username){
        res.render('create', { Name: 'guest' });
    }
    else{
    res.render('create', { Name: req.session.username });}
});

// Add song to playlist route
let songlist = [];

router.post('/add', (req, res) => {
    const { Song } = req.body;
    if (Song) {
        songlist.push(Song);
        res.json({ message: 'Song added successfully', songlist });
    } else {
        res.status(400).json({ message: 'Song not provided' });
    }
});

// Save playlist route
router.post('/create', async(req, res) => {
    try {
        if (!req.session.username) {
            res.render('index', { dis: "display", shows: "show", image: "profile.png", Name: '' });
        } else {
            usernames=req.session.username
            const newPlaylist = await playlist.create({
                username: usernames,
                playlist: req.body.name,
                SongList: songlist
            });
            songlist=[]
            res.render('index', { dis: "show", shows: "display", image: "profile.png", Name: req.session.username });
        }
    } catch (err) {
        if (err.code === 11000) { // MongoDB duplicate key error code
            res.status(400).json({ message: 'Duplicate playlist req.session.username' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});
let name 
router.get('/modify',(req,res)=>{
    name =req.query.playlist
    res.render('modify',{ Name: req.session.username,playname: req.query.playlist })
})
router.post('/modify',async(req,res)=>{
    if (!req.session.username) {
        res.render('index', { dis: "display", shows: "show", image: "profile.png", Name: '' });
      } else {
        try {
         const playss= await playlist.updateOne(
            { username: req.session.username, playlist: name },
            { $push: { SongList: { $each: songlist } } }
          );
          res.render('index', { dis: "show", shows: "display", image: "profile.png", Name: req.session.username });
          }  catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
})

router.get('/redirect',(req,res)=>{
    if (!req.session.username) {
        res.render('index', { dis: "display", shows: "show", image: "profile.png", Name: '' });
    }
    else{
        res.render('index', { dis: "show", shows: "display", image: "profile.png", Name: req.session.username });
    }
})

router.get('/play',(req,res)=>{
    if (!req.session.username) {
        res.render('playlist', { dis: "display", shows: "show", image: "profile.png", Name: 'guest' ,PlaylistName:req.query.playlist, Image:req.query.image});
    }
    else{
        res.render('playlist', { dis: "show", shows: "display", image: "profile.png", Name: req.session.username,PlaylistName:req.query.playlist, Image:req.query.image });
    }
})
module.exports = router