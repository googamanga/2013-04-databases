
DROP DATABASE IF EXISTS `chat`;

CREATE DATABASE chat;

USE chat;

DROP TABLE IF EXISTS `Storage`;

CREATE TABLE `Storage` (
  `id` TINYINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50),
  `text` VARCHAR(255),
  `roomname` VARCHAR(50) DEFAULT 'defaultRoom',
  `hax` VARCHAR(250),
  PRIMARY KEY (`id`)
);

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
