/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require("request");

describe("Persistent Node Chat Server", function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: "hackreactor",
      password: "plantlife",
      database: "chat"
    });
    dbConnection.connect();
    console.log('CONNECTION START');

    var tablename = "Storage";
    dbConnection.query("DELETE FROM " + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
    console.log('CONNECTION END');
  });

  it("Should insert posted messages to the DB", function(done) {
    console.log('start first test', Date());
    request({method: "POST",
      uri: "http://127.0.0.1:8080/classes/room1",
      form:{username: "Valjean",
            text: "In mercy's name, three days is all I need."}
    },
    function(error, response, body) {
      var queryString = "SELECT * FROM Storage WHERE username=? AND text=?";
      var queryArgs = ["Valjean", "In mercy's name, three days is all I need."];
      dbConnection.query( queryString, queryArgs,
        function(err, results, fields) {
          expect(results.length).toEqual(1);
          expect(results[0].username).toEqual("Valjean");
          expect(results[0].text).toEqual("In mercy's name, three days is all I need.");
          console.log('end first test', Date());
          done();
        }
      );
    });
  });

  it("Should output all messages from the DB", function(done) {
    console.log('start second test', Date());
    var tablename = "Storage"; // : fill this out
    // Let's insert a message into the db
    var queryString = "INSERT INTO " + tablename + " SET ?";
    var queryArgs = {'username': "Javert", 'text': "Men like you can never change!"};


    dbConnection.query( queryString, queryArgs,
      function(err, results, fields) {
        console.log('error', err, ' results', results);
        /* Now query the Node chat server and see if it returns
         * the message we just inserted: */
        request("http://127.0.0.1:8080/classes/room1",
          function(error, response, body) {
            console.log("body: ",body);
            var messageLog = JSON.parse(body);
            expect(messageLog[0].username).toEqual("Javert");
            expect(messageLog[0].text).toEqual("Men like you can never change!");
            console.log('finished second test', Date());
            done();
          });
      });
  });
});
