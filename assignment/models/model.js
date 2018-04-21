var mongoose = require('mongoose');

//used in heroku
//               mongodb://<dbuser>:<dbpassword>@ds151809.mlab.com:51809/heroku_85rcp4z8
var db = mongoose.connect('mongodb://xiwensong:0@ds151809.mlab.com:51809/heroku_85rcp4z8');

module.exports = db;
