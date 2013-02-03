var mongoose = require('mongoose')
  , Vote = mongoose.model('Vote')
  , User = mongoose.model('User')
  , Play = mongoose.model('Play')

module.exports = function(app) {
  app.post('/api/vote', function (req, res){
    var vote;
    console.log("POST: ");
    console.log(req.body);
    var phoneNumber = req.body.From;
    User.findOne({ phoneNumber: phoneNumber }).exec(function(err, user) {
      Play.find({}).sort('-_id').limit(1).exec(function(err, play) {
        vote = new Vote({
          vote: req.body.Body,
          _play: play[0]._id,
          _user: user._id
        });
        vote.save(function (err) {
          if (!err) {
            return console.log("created");
          } else {
            return console.log(err);
          }
        });
        return res.send(vote);
      }); 
    });
  });
}


