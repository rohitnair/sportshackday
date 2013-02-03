var mongoose = require('mongoose');
var VoteSchema = new mongoose.Schema({
  value: String,
  _play: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Play' }],
  _user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})


mongoose.model('Vote', VoteSchema)
