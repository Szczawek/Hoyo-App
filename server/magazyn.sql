-- Active: 1697937413972@@127.0.0.1@3306@magazine
SELECT commentID FROM likes where `userID` = 81

SELECT * FROM user

SELECT * from user_comments where id IN (0)


SELECT * FROM user_comments


SELECT * FROM followers

SELECT  personID as following FROM followers where `ownerID` = 72;
SELECT COUNT(ID) as followers FROM followers where `personID` = 72