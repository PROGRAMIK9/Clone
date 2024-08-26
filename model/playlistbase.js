const mongoose = require('mongoose')
const playlistSchema = new mongoose.Schema({
    username: { type: String, required: true},
    playlist :{type:String, required:true},
    SongList: {type:[String]}
})
playlistSchema.index({ username: 1, playlist: 1 }, { unique: true });

module.exports = mongoose.model("playlist", playlistSchema)