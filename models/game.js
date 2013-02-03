var mongoose = require('mongoose');
var GameSchema = new mongoose.Schema({
  teamA: String,
  teamB: String,
  venue: String,
  plays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Play' }] 
});

mongoose.model('Game', GameSchema)
