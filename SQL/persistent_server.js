var fs = require('fs');
var url = require("url");
var querystring = require("querystring");
var http = require('http');
var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "hackreactor",
  password: "plantlife",
  database: "chat"
});
dbConnection.connect();

var storage = {
  messages: {
    "results":[]
  }
};
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
  else if (request.url === '/assets/js/setup.js') {
    fs.readFile('./app/' + request.url,'utf8',function (err, data) {
      returnCode = 200;
      defaultCorsHeaders["Content-Type"] = "text/javascript";
      response.writeHead(returnCode, defaultCorsHeaders);
      response.end(data);
    });
    return;
  }
  else if (request.url === '/assets/lib/jquery.js') {
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
      var queryString = "SELECT * FROM Storage";
      return dbConnection.query( queryString,
          function(err, results, fields) {
          //when client is asking for room, then return all messages from database where room is a match
          returnCode = 200;
          defaultCorsHeaders["Content-Type"] = "application/json";
          response.writeHead(returnCode, defaultCorsHeaders);
          response.end(JSON.stringify(results));
        }
      );
    } else if(request.method === 'POST'){
      var fullBody = '';
      request.on('data', function(chunk) {
        fullBody += chunk;
      });
      return request.on('end', function() {
        var data = querystring.parse(fullBody);
         // * See https://github.com/felixge/node-mysql for more details about
         // * using this module.*/
        var tablename = "Storage";
        dbConnection.query("INSERT INTO " + tablename + " SET ?", data, function(err, result){
          returnCode = 201;
          response.end();
        });

      });
    } else if(request.method === 'OPTIONS'){
      returnCode = 200;
    }
    response.writeHead(returnCode, defaultCorsHeaders);
    response.end(body);
    return;
  }
  console.log('should not see this!');
};


var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handleRequest);

server.listen(port, ip);