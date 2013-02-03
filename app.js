var application_root = __dirname,
  fs = require('fs'),
  express = require("express"),
  path = require("path"),
  mongoose = require('mongoose');

var app = express();

// Connect to db, localhost if no ENV vars set
var uristring = 
  process.env.MONGODB_URI || 
  process.env.MONGOLAB_URI || 
  'mongodb://localhost/gal';

// Ensure safe writes
var mongoOptions = { db: { safe: true }};

// Connect
mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

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
var port = process.env.PORT || 4242;
app.listen(port, function() {
  console.log("Listening on " + port);
});
