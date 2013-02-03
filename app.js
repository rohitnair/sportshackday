var application_root = __dirname,
  fs = require('fs'),
  express = require("express"),
  path = require("path"),
  mongoose = require('mongoose');

var app = express();

// Database
mongoose.connect('mongodb://localhost/gal');

// Config
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

// Bootstrap controllers 
var controllers_path = __dirname + '/controllers'
fs.readdirSync(controllers_path).forEach(function (file) {
  require(controllers_path+'/'+file)(app)
})

app.get('/api', function (req, res) {
  res.send('Ecomm API is running');
});

// Launch server
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
