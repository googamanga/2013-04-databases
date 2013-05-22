var fs = require('fs');
var url = require("url");
var querystring = require("querystring");
var http = require('http');
//var mysql = require('mysql');
var Sequelize = require("sequelize");


var sequelize = new Sequelize("chat", "hackreactor", "plantlife");

var Message = sequelize.define('Message', {
  //id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  username: Sequelize.STRING,
  text: Sequelize.STRING,
  roomname: { type: Sequelize.STRING, defaultValue: 'defaultRoom'},
  hax: Sequelize.STRING
});

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GETS, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 //seconds
};

handleRequest = function(request, response) {
  var url_parts = url.parse(request.url, true),
      pathNameArray = (url_parts.pathname).split('/'),
      roomName = pathNameArray[pathNameArray.length-1],
      query = url_parts.query,
      returnCode = 404;
  //check if room exists
  if (request.url === '/index.html' || request.url === '/') {
    fs.readFile('./app/index.html','utf8',function (err, data) {
      returnCode = 200;
      defaultCorsHeaders["Content-Type"] = "text/html";
      response.writeHead(returnCode, defaultCorsHeaders);
      response.end(data);
    });
    return;
  }
  else if (request.url === '/assets/img/binding_dark.png') {
    returnCode = 404;
    response.writeHead(returnCode, { "Content-Type" : "image/png" });
    response.end();
  }
  else if (request.url === '/assets/css/styles.css') {
    fs.readFile('./app/' + request.url,'utf8',function (err, data) {
      returnCode = 200;
      defaultCorsHeaders["Content-Type"] = "text/css";
      response.writeHead(returnCode, defaultCorsHeaders);
      response.end(data);
    });
    return;
  }
  else if (request.url === '/assets/js/setup.js' || request.url === '/assets/lib/jquery.js') {
    fs.readFile('./app/' + request.url,'utf8',function (err, data) {
      returnCode = 200;
      defaultCorsHeaders["Content-Type"] = "text/javascript";
      response.writeHead(returnCode, defaultCorsHeaders);
      response.end(data);
    });
    return;
  }
  if (pathNameArray[1] === 'classes') {
    if(request.method === 'GET'){
      // Retrieve objects from the database:
      return Message.findAll().success(function(messages) {
        var body = {'results': messages };
        returnCode = 200;
        defaultCorsHeaders["Content-Type"] = "application/json";
        response.writeHead(returnCode, defaultCorsHeaders);
        // var res = '';
        // try {
        //   res = querystring.parse(body);
        // } catch (e) {
        //   res = JSON.parse(body);
        // } finally {
          response.end(JSON.stringify(body));
        // }
      });
    } else if(request.method === 'POST'){
      var fullBody = '';
      request.on('data', function(chunk) {
        fullBody += chunk;
      });
      return request.on('end', function() {
        var data = querystring.parse(fullBody);
        var message = Message.build(data);
        return message.save().success(function() {
          returnCode = 201;
          response.end();
        });
      });
    } else if(request.method === 'OPTIONS'){
      returnCode = 200;
    }
    response.writeHead(returnCode, defaultCorsHeaders);
    response.end();
    return;
  }
};


/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */
Message.sync().success(function() {

  var port = 8080;
  var ip = "127.0.0.1";
  var server = http.createServer(handleRequest);

  server.listen(port, ip);

});

















