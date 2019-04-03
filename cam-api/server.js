var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var cams = require('./routes/camera-api');
var players = require('./routes/player-api');
var positions = require('./routes/positions-api');
var accounts = require('./routes/account-api');


var port = 3000;
var app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//set static folder, angular
app.use(express.static(path.join(__dirname, 'client')));

//Body Parser Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/api', cams);
app.use('/api', players);
app.use('/api', positions);
app.use('/api', accounts);


app.listen(port, function(){
	console.log('[+] Server Started on Port '+port);
});
