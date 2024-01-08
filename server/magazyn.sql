-- Active: 1697937413972@@127.0.0.1@3306@magazine

SELECT * from `user`


SELECT * FROM user

UPDATE user set `Avatar` = "/images/user.svg"

UPDATE comments set avatar ="/images/22.jpg" WHERE `userID` = 72

SELECT * FROM comments

CREATE Table replies(id int AUTO_INCREMENT,commentID int,content TEXT,date DATETIME,avatar VARCHAR(255), nick VARCHAR(255),PRIMARY KEY(id))

SELECT * FROM replies

INSERT into replies(`commentID`,content,date,avatar,nick) VALUES(0,"sdsddsd", "2323;sdsds","sdsdsd","szczas")

SELECT * FROM user