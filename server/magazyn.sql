-- Active: 1697937413972@@127.0.0.1@3306@magazine

SELECT * from test


INSERT INTO test VALUES(null, NULL)

CREATE TABLE folowers(id int AUTO_INCREMENT PRIMARY KEY, ownerID int,person INT)

SELECT * FROM folowers

SELECT id FROM folowers where ownerID = 12 and personID = 123

DROP TABLE folowers

CREATE TABLE followers(id int AUTO_INCREMENT PRIMARY KEY, ownerID int, personID INT)


INSERT INTO followers values(null,12,123)



SELECT id from followers where `ownerID` = 12 and `personID` = 123


SELECT * FROM followers

SELECT id,date
 FROM comments

 DELETE FROM followers where id = 1

 SELECT nick, about, avatar, id, (SELECT COUNT(id) from followers where personID = user.id) as follow from user

 SELECT * FROM user

 UPDATE `user` set avatar = null,  nick = "TaboretQ" where id = 97