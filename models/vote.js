var mongoose = require('mongoose');
var VoteSchema = new mongoose.Schema({
  value: String,
  phoneNumber: String,
  _play: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Play' }],
})


mongoose.model('Vote', VoteSchema)
