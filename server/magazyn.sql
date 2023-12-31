-- Active: 1697937413972@@127.0.0.1@3306@magazine


ALTER TABLE comments ADD COLUMN avatar VARCHAR(255)

SELECT * FROM `likes`

SELECT * FROM comments

CREATE TABLE [dbo].[sessions](
    [sid] [nvarchar](255) NOT NULL PRIMARY KEY,
    [session] [nvarchar](max) NOT NULL,
    [expires] [datetime] NOT NULL
)

show DATABASES

SELECT comments.nick FROM comments LEFT JOIN likes on comments.id = likes.commentID

SELECT * FROM likes

SELECT COUNT(id) FROM likes WHERE `commentID` > 60

SELECT comments.*, (SELECT COUNT(`commentID`) FROM likes where `commentID` = comments.id) as likes FROM comments

SELECT comments.*, (SELECT COUNT(`commentID`) FROM likes where `commentID` = comments.id) as likes FROM comments where id = 56

SELECT * from comments
UPDATE comments set nick = "Szczawik" where userID = 69

SELECT * from comments

UPDATE comments set nick = "Szczawik" where userID = 69

SELECT * FROM comments

UPDATE comments set avatar = "images/22.jpg" where userID = 69

SELECT * FROM comments

UPDATE comments set avatar = "images\ss.jpg" WHERE `userID` = 72 

UPDATE comments set nick = "Deku" WHERE `userID` = 72


SELECT * FROM comments


UPDATE comments set nick = "Deku" WHERE `userID` = 72

SELECT * FROM comments

UPDATE comments set avatar = `images\ss.jpg` WHERE `userID` = 72

SELECT * FROM likes