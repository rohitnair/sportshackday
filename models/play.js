var mongoose = require('mongoose');
var PlaySchema = new mongoose.Schema({
  yardline: Number,
  offence: String,
  defence: String,
  _game: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
});

mongoose.model('Play', PlaySchema)
