var mongoose = require('mongoose')
  , Game = mongoose.model('Game')

module.exports = function(app) {
  app.post('/api/game', function (req, res){
    var game;
    console.log("POST: ");
    console.log(req.body);
    game = new Game({
      teamA: req.body.teamA,
      teamB: req.body.teamB,
      venue: req.body.venue
    });
    game.save(function (err) {
      if (!err) {
        return console.log("created");
      } else {
        return console.log(err);
      }
    });
    return res.send(game);
  }); 
}
