var url = require("url");
var querystring = require("querystring");
var http = require('http');
var mysql = require('/opt/boxen/nodenv/versions/v0.8/lib/node_modules/mysql');
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
  console.log('Serving awesome requests types '+ request.method + ' for url ' + request.url);
  var url_parts = url.parse(request.url, true),
      pathNameArray = (url_parts.pathname).split('/'),
      roomName = pathNameArray[pathNameArray.length-1],
      query = url_parts.query,
      returnCode = 404,
      body = 'hello worlds';
  //check if room exists
  console.log(request.url);
  if (request.url === '/index.html' || request.url === '/') {
    fs.readFile('./app/index.html','utf8',function (err, data) {
      // if (err) throw err;
      returnCode = 200;
      defaultCorsHeaders["Content-Type"] = "text/html";
      response.writeHead(returnCode, defaultCorsHeaders);
      // response.write(data);
      response.end(data);
    });
    return;
  }
  else if (request.url === '/assets/img/binding_dark.png') {
    returnCode = 404;
    response.writeHead(returnCode, { "Content-Type" : "image/png" });
    response.end();
    // fs.createReadStream('./app/' + request.url).pipe(response);
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
    if(!storage[roomName]) {storage[roomName] = {results: []};}
    if(request.method === 'GET'){
      returnCode = 200;
      body = "";
    } else if(request.method === 'POST'){
      var fullBody = '';
      request.on('data', function(chunk) {
        fullBody += chunk;
      });
      request.on('end', function() {
        console.log("fullbody:",fullBody);
        var data = querystring.parse(fullBody);
        console.log('data', data);
        //storage[roomName].results.unshift(data);
        //open the connection to db
        //insert data from request into db
        //clsoe db
        //send response

        dbConnection.connect();
         // * See https://github.com/felixge/node-mysql for more details about
         // * using this module.*/
        var tablename = "Storage"; // : fill this out
        dbConnection.query("INSERT INTO posts SET ?" + tablename, data, function(err, result){
          returnCode = 201;
          console.log('result', result);
          dbConnection.end();


        });

      });
    } else if(request.method === 'OPTIONS'){
      returnCode = 200;
      console.log('AAAHHHH REAL OPTIONS');
    } else {
      console.log('ERRRRORRRR i saw: ', request.method);
    }
    response.writeHead(returnCode, defaultCorsHeaders);
    response.end(body);
    return;
  }
  response.end();
};


var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handleRequest);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

var stream = require('stream');
var url = require("url");
var fs = require('fs');
