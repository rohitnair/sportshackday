var mongoose = require('mongoose')
  , User = mongoose.model('User')

module.exports = function(app) {
  app.post('/api/user', function (req, res){
    var user;
    console.log("POST: ");
    console.log(req.body);
    user = new User({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber
    });
    user.save(function (err) {
      if (!err) {
        return console.log("created");
      } else {
        return console.log(err);
      }
    });
    return res.send(user);
  }); 
}

