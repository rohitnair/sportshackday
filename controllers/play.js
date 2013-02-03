var mongoose = require('mongoose')
  , Play = mongoose.model('Play')
  , Game = mongoose.model('Game')

module.exports = function(app) {
  app.post('/api/play', function (req, res){
    var play;
    console.log("POST: ");
    console.log(req.body);
    Game.find({}).sort('-_id').limit(1).exec(function(err, currentGame) {
      console.log("Current game = " + currentGame[0]._id);
      play = new Play({
        _game: currentGame[0]._id,
        yardline: req.body.yardline,
        offence: req.body.offence,
        defence: req.body.defence
      });
      play.save(function (err) {
        if (!err) {
          return console.log("created");
        } else {
          return console.log(err);
        }
      });
      return res.send(play);
    });
  }); 
}

