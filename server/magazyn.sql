-- Active: 1697937413972@@127.0.0.1@3306@magazine
SELECT commentID FROM likes where `userID` = 81

SELECT * FROM user

SELECT * from user_comments where id IN (0)


SELECT * FROM user_comments


SELECT * FROM followers

SELECT  personID as following FROM followers where `ownerID` = 72;
SELECT COUNT(ID) as followers FROM followers where `personID` = 72


SELECT * FROM user_comments

SELECT *, (SELECT COUNT(id) from user_comments where user_comments.id = reply) as followers FROM user_comments 

SELECT COUNT(id) as follows FROM user_comments where reply = id

SELECT  uc.*, COUNT(reply.id) AS followers,(SELECT COUNT(ID) from likes where commentID = user_comments.id) as likes FROM user_comments uc LEFT JOIN user_comments reply ON uc.id = reply.reply GROUP BY uc.id;

-- PRAWIE DOBRZE
SELECT * , (SELECT COUNT(ID) FROM likes where `commentID` = us.id) as likes ,COUNT(reply.id) as followers FROM user_comments us LEFT JOIN user_comments reply on us.id = reply.reply GROUP BY us.id, reply.id


SELECT *, (SELECT COUNT(*) FROM user_comments reply WHERE reply.reply = uc.id) AS followers FROM user_comments uc;



SELECT * FROM user_comments

SELECT *,(SELECT COUNT(id) FROM user_comments REPLY where reply.reply = user_comments.id) as replies, (SELECT COUNT(ID) from likes where commentID = user_comments.id) as likes FROM user_comments where ownerID = 72 AND reply IS NOT NULL ORDER BY id DESC LIMIT 8 OFFSET 0


SELECT * FROM `user`

SHOW TABLESPACE

SELECT * from followers


SELECT * FROM likes

SELECT * FROM user_comments


SELECT * FROM `user`

SELECT * from `user` where id = 102

ALTER TABLE `user` ADD hashName VARCHAR(255)


ALTER Table user_comments ADD hashName VARCHAR(255)

SELECT * FROM user

ALTER TABLE user ADD baner TEXT;

UPDATE TABLE user set "./images/baner.png" where id > 0


SELECT * from user_comments

UPDATE user_comments SET avatar = "/images/user.svg" where nick = "Deku";



SHOW DATABASEs

use test

SHOW TABLESPACE

use mySQL

SHOW TABLESPACE

SELECT * FROM `user`

use magazine 

show tables


SHOW CREATE TABLE user_comments



SELECT * FROM user_comments


SHOW CREATE TABLE followers



SELECT * FROM user


SELECT * FROM user_comments


    SELECT * FROM `user` RIGHT JOIN user_comments ON user.id = user_comments.ownerID 


    UPDATE user_comments SET hashName = {
        SELECT `hashName` FROM user where user.id = user_comments.ownerID
    }


    UPDATE user_comments
SET hashName = (
    SELECT user.hashName
    FROM `user`
    WHERE user.id = user_comments.ownerID
);


SELECT nick, avatar,hashName FROM `user` LIMIT 5



UPDATE user set baner = "/images/baner.png"

SELECT * FROM user


SELECT * FROM user_comments

UPDATE user_comments set avatar = "/images/user.svg"
