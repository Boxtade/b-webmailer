var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mail = require('./routes/mail');

var app = express();

var corsOptions = {
  origin: '*',
  methods: ['POST','GET'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.start = function(opt) {
  mail.setting(opt);
  app.listen(opt.port); // Look at the asynchronous.
  console.log("Server has started.");
  console.log('Server running at http://localhost:'+opt.port+'/');
};

app.post('/mail',mail.send);
app.get('/mail',mail.token);

