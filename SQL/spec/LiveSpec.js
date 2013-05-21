/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require("request"); // You might need to npm install the request module!

describe("Persistent Node Chat Server", function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
    /* : Fill this out with your mysql username */
      user: "hackreactor",
    /* and password. */
      password: "plantlife",
      database: "chat"
    });
    dbConnection.connect();

    var tablename = "Storage"; // : fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query("DELETE FROM " + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it("Should insert posted messages to the DB", function(done) {
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
          done();
        }
      );
    });
  });

  xit("Should output all messages from the DB", function(done) {
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
            var messageLog = JSON.parse(body);
            expect(messageLog[0].username).toEqual("Javert");
            expect(messageLog[0].text).toEqual("Men like you can never change!");
            done();
          });
      });
  });
});
