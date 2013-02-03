var mongoose = require('mongoose')
  , Vote = mongoose.model('Vote')
  , Play = mongoose.model('Play')

module.exports = function(app) {
  app.post('/api/vote', function (req, res){
    var vote;
    console.log("POST: ");
    console.log(req.body);
    var phoneNumber = req.body.From;
    Play.find({}).sort('-_id').limit(1).exec(function(err, play) {
      var voteValue = req.body.Body.trim().toLowerCase();
      vote = new Vote({
        value: voteValue,
        phoneNumber: req.body.From,
        _play: play[0]._id,
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

  app.get('/api/votes', function (req, res){
    Vote.find({}).exec(function(err, votes) {
      var yes = 0;
      var no = 0;
      for(var i = 0; i < votes.length; i++) {
        if (votes[i].value === "yes") {
          yes += 1;
        } else if (votes[i].value === "no") {
          no += 1;
        }
      }
      return res.send({Yes: yes, No: no})
    });
  });
}


