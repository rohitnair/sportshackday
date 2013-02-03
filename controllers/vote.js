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
          value: req.body.Body,
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

  app.get('/api/votes', function (req, res){
    Vote.find({}).exec(function(err, votes) {
      var yes = 0;
      var no = 0;
      for(var i = 0; i < votes.length; i++) {
        if (votes[i].value.trim().toLowerCase() === "yes") {
          yes += 1;
        } else if (votes[i].value.trim().toLowerCase() === "no") {
          no += 1;
        }
      }
      return res.send({Yes: yes, No: no})
    });
  });
}


