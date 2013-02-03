var application_root = __dirname,
  fs = require('fs'),
  express = require("express"),
  path = require("path"),
  http = require("http"),
  mongoose = require('mongoose'),
  cons = require('consolidate'),
  swig = require('swig');

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
  app.engine('.html', cons.swig);
  app.set('view engine', 'html');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.static(__dirname + '/static'));
  swig.init({
    root: __dirname + '/public',
    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
  });
  app.set('views', __dirname + '/public');
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

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

// Launch server
var port = process.env.PORT || 4242;
server.listen(port, function() {
  console.log("Listening on " + port);
});

Vote = mongoose.model('Vote');

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set("log level", 2);
});

io.sockets.on('connection', function (socket) {
  console.log("connected");
  var stream = Vote.find().tailable().stream();

  stream.on('data', function(vote) {
    console.log(vote);
    if (vote.value === 'yes') {
      socket.emit('yes');
    } else if (vote.value === 'no') {
      socket.emit('no');
    }
  });
});

app.get('/index', function (req, res) {
  res.render('index.html', { 
    yes: 0,
    no: 0
  });
});
