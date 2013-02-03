var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String
});

mongoose.model('User', UserSchema)
