const express = require('express');
const router = express.Router()
router.get('/', (req, res) => {
    res.render('index', { dis: "", shows: "", image: "profile.png", Name: '' });
});
router.get('/search',(req,res)=>{
    if (!req.session.username) {
        res.render('search', { dis: "display", shows: "show", image: "profile.png", Name: 'guest' });
    }
    else{
        res.render('search', { dis: "show", shows: "display", image: "profile.png", Name: req.session.username });
    }
})
module.exports=router