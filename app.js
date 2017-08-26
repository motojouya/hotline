var express = require('express'),
    path = require('path');

var app = express();

var route = {
   home : require('routes/home'),
   contents : require('routes/contents')
};

app.use(express.static(path.join(__dirname,'static')));

app.use('/',route.home);
app.use('/contents',route.contents);


