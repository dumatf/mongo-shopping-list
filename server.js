require('./db/connect'); //connects to mongo db
var express = require('express');
var bodyParser = require('body-parser');
var itemRoutes = require('./routes/item');
var app = express();

//console.log(itemRoutes);

app.use(bodyParser.json()); //set up middleware to parse http request body as JSON
app.use(express.static('public')); //serve static files

app.use('/', itemRoutes); //setup item routes
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'}); //setup a catch all 404 page
});

app.listen(8080, function() {
  console.log('Listening on port 8080');
});

exports.app = app;

/*

server.js
--db/connect.js
----environment.js
----db/config.json
--routes/item.js
----services/items.js
------models/item.js

*/