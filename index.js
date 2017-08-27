'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 5010;

app.use(express.static(__dirname + 'public'));
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

/*
 * var route = express.Router;
 * route.get('/', function(req, res, next){
 *   res.send("Hello World");
 * });
 * app.use('/api/v1', route);
 */
//var route = require('src/server/home');

