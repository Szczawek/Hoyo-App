-- Active: 1697937413972@@127.0.0.1@3306@magazine


SELECT nick,avatar FROM `user`



SHOW TABLES

CREATE TABLE user_comments(id INT AUTO_INCREMENT, ownerID int, nick VARCHAR(255), avatar TEXT, content TEXT, date DATETIME,reply INT, PRIMARY KEY(ID))

INSERT INTO user_comments(`ownerID`, nick , avatar , content ,date ,reply) VALUES(?,?,?,?,?)


SELECT * FROM user_comments WHERE id 



SELECT * FROM user_comments


SELECT * FROM user_comments GROUP BY id DESC LIMIT 1 