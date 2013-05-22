/* You'll need to
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */

var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "hackreactor", "plantlife");

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var Message = sequelize.define('Message', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  username: Sequelize.STRING,
  text: Sequelize.STRING,
  roomname: { type: Sequelize.STRING, defaultValue: 'defaultRoom'},
  hax: Sequelize.STRING
});

/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */
Message.sync().success(function() {
  /* This callback function is called once sync succeeds. */

  // now instantiate an object and save it:
  var newUser = Message.build({username: "Jean Valjean"});
  newUser.save().success(function() {
    /* This callback function is called once saving succeeds. */

    // Retrieve objects from the database:
    Message.findAll({ where: {username: "Jean Valjean"} }).success(function(usrs) {
      // This function is called back with an array of matches.
      for (var i = 0; i < usrs.length; i++) {
        console.log(usrs[i].username + " exists");
      }
    });
  });
});
