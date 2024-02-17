import express from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";
import "dotenv/config";
import fs from "fs";
import CryptoJS from "crypto-js";
import cookieParser from "cookie-parser";
import multer from "multer";

const PORT = 80;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// connecting to a database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DATABASE_PASSWORD,
  database: "magazine",
});

// save pictures to a disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../app/public/users-pictures");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    cb(null, `${file.originalname}-${fileName}`);
  },
});

// picture size limit
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 10,
  },
});

// Loads a single comment
app.post("/selected-comment", (req, res) => {
  const { id } = req.body;
  const command =
    "SELECT *,(SELECT COUNT(ID) FROM likes where commentID = comments.id) as likes FROM comments where id = ?";
  db.query(command, [id], (err, result) => {
    if (err) throw Error(`Error with database #single-comment: ${err}`);
    res.json(result[0]);
  });
});

// Loads all user comments
app.post("/user-comments", (req, res) => {
  const { type, page } = req.body;
  const command = `SELECT *,(SELECT COUNT(ID) FROM likes where commentID = comments.id) as likes FROM comments where userID = ? ORDER BY id DESC LIMIT 10 OFFSET ${page}`;
  db.query(command, [type, page], (err, data) => {
    if (err) throw Error(`Error with database #user-comments: ${err}`);
    const comNumber = `SELECT COUNT(id) as comments_number FROM COMMENTS where userID = ?`;
    db.query(comNumber, [type], (err, result) => {
      if (err) throw Error(`Error with comments_length: ${err}`);
      res.json({
        comments: data,
        comments_number: result[0]["comments_number"],
      });
    });
  });
});

// load comments
app.post("/comments", function (req, res) {
  const { page } = req.body;
  const command = `SELECT *,(SELECT COUNT(ID) FROM likes where commentID = comments.id) as likes FROM comments ORDER BY id DESC LIMIT 10 OFFSET ${page}`;
  db.query(command, [page], (err, data) => {
    if (err) throw Error(`Error with database #user-comments: ${err}`);
    const comNumber = `SELECT COUNT(id) as comments_number FROM COMMENTS`;
    db.query(comNumber, (err, result) => {
      if (err) throw Error(`Error with comments_length: ${err}`);
      res.json({
        comments: data,
        comments_number: result[0]["comments_number"],
      });
    });
  });
});

// load replies
app.post("/replies", (req, res) => {
  const { page, commentID } = req.body;
  const command = `SELECT *,(SELECT COUNT(ID) FROM likes where commentID = replies.id) FROM replies where commentID = ? ORDER BY ID DESC LIMIT 10 OFFSET ${page}`;
  db.query(command, [commentID, page], (err, data) => {
    if (err) throw Error(`Error with database #replies: ${err}`);
    const comNumber = `SELECT COUNT(id) as comments_number FROM replies where commentID = ?`;
    db.query(comNumber, [commentID], (err, result) => {
      if (err) throw Error(`Error with comments_length: ${err}`);
      res.json({
        comments: data,
        comments_number: result[0]["comments_number"],
      });
    });
  });
});

// add replies
app.post("/add-replies", (req, res) => {
  const { commentID } = req.body;
  const data = createComment(req, res);
  data.push(Number(commentID));
  const command = "INSERT INTO replies VALUES (NULL,?, ?, ?, ?, ?,?)";
  db.query(command, data, (err) => {
    if (err) throw Error(`Error with database #add-replies: ${err}`);
    // Download the current commentary on function optimization
    const downloadCommand = "SELECT * FROM replies ORDER BY ID DESC LIMIT 1";
    db.query(downloadCommand, (err, result) => {
      if (err) throw Error(`Error with download the last replies: ${err}`);
      result[0].likes = 0;
      res.json(result[0]);
    });
  });
});

// remove comment
app.post("/remove-comment", function (req, res) {
  const command = "DELETE FROM comments WHERE id = ?";
  db.query(command, [req.body["id"]], function (err) {
    if (err) throw Error(`Error with database #remove-comment${err}`);
    res.sendStatus(200);
  });
});

// create comment first segment
function createComment(req, res) {
  const data = req.cookies["logged"];
  if (!data) return res.sendStatus(400);
  const { nick, value, avatar } = req.body;
  // decrypt cookie
  const bytes = CryptoJS.AES.decrypt(data, process.env.COOKIE_KEY);
  const { id } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const commentData = [
    id,
    nick,
    value,
    avatar,
    new Date(),
  ];
  return commentData;
}

// Add comment to account
app.post("/add-comment", function (req, res) {
  const data = createComment(req, res);
  const command =
    "INSERT INTO comments(userID, nick, content, avatar, date) values(?,?,?,?,?)";
  db.query(command, data, (err) => {
    if (err) throw Error(`Error with database #add-comment${err}`);
    // Download the current commentary on function optimization
    const downloadCommand = "SELECT * FROM comments ORDER BY ID DESC LIMIT 1";
    db.query(downloadCommand, (err, result) => {
      if (err) throw Error(`Error with download the last comment: ${err}`);
      result[0].likes = 0;
      res.json(result[0]);
    });
  });
});

// Load User Profile date
app.get("/users:nick", function (req, res) {
  const { nick } = req.params;
  const command =
    "SELECT nick, about, avatar, id, (SELECT COUNT(id) from followers where personID = user.id) as follow from user";
  db.query(command, function (err, userData) {
    if (err) throw Error(`Error with database #users userData: ${err}`);
    const obj = userData.find(
      (e) => e["nick"].toLowerCase() === nick.toLowerCase()
    );
    if (!obj) return res.sendStatus(405);
    res.send(obj);
  });
});

// Create an account
app.post("/create-account", function (req, res) {
  const command = "select id from user where login = ?";
  const { login, nick, password } = req.body;

  db.query(command, [login], function (err, data) {
    if (err) throw Error(`Error with database: ${err}`);

    const accountExists = data[0];

    if (!accountExists) {
      encryption(password)
        .then((encPassword) => {
          const command =
            "INSERT INTO `user` (`Login`, `Password`, `nick`, `About`, `date`, `avatar`) values(?,?,?,?,?,?)";

          const value = [
            login,
            encPassword,
            nick,
            "",
            new Date(),
            "/images/user.svg",
          ];
          db.query(command, value, (err) => {
            if (err) throw Error(`Error with database #create-account: ${err}`);
            res.sendStatus(200);
          });
        })
        .catch((err) => {
          throw Error(`Error during email validation: ${err}`);
        });
      return;
    }
    res.sendStatus(400);
  });
});

// password encryption
async function encryption(e) {
  return await bcrypt.hash(e, 10);
}

// remove account
app.post("/remove", function (req, res) {
  const command = "DELETE from user where id =?";
  const commandComments = "DELETE from comments where userID =?";
  const commandLikes = "DELETE from likes where userID = ?";
  const bytes = CryptoJS.AES.decrypt(
    req.cookies["logged"],
    process.env.COOKIE_KEY
  );
  const { id } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  res.clearCookie("logged", { httpOnly: true });
  db.query(command, [id], function (err) {
    if (err) throw Error(`Error with database #remove: ${err}`);
  });
  db.query(commandComments, [id], function (err) {
    if (err)
      throw Error(`Error with database #remove-comments in remove : ${err}`);
  });
  db.query(commandLikes, [id], function (err) {
    if (err)
      throw Error(`Error with database #remove-likes in remove : ${err}`);
  });
  res.sendStatus(200);
});

// Login to an account
app.post("/login", function (req, res) {
  const command = "select password,id from user where Login = ?";
  const userLogin = req.body["login"];

  db.query(command, [userLogin], function (err, data) {
    if (err) throw Error(`Error with database #login: ${err}`);
    if (!data[0]) {
      res.sendStatus(400);
      return;
    }
    checkPassword(data)
      .then((isMatch) => {
        if (isMatch) {
          const copy = { ...data[0] };
          delete copy.password;
          const encryptID = CryptoJS.AES.encrypt(
            JSON.stringify(copy),
            process.env.COOKIE_KEY
          ).toString();
          res.cookie("logged", encryptID, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 60 * 24,
          });
          res.sendStatus(200);
          return;
        }
        res.sendStatus(400);
      })
      .catch((err) => {
        throw Error(`Error during password validation: ${err}`);
      });
  });

  async function checkPassword(data) {
    const passwordToCheck = req.body["password"];
    const correctPassword = data[0]["password"];
    const result = await bcrypt.compare(passwordToCheck, correctPassword);
    return result;
  }
});

// Logout
app.post("/logout", function (req, res) {
  res.clearCookie("logged", { maxAge: 0 });
  res.sendStatus(200);
});

// Check login status
app.get("/logged", function (req, res) {
  const login = req.cookies["logged"];
  if (!login) return res.sendStatus(400);
  const command = "SELECT id,nick,about,avatar,date FROM user where id =?";
  // decrypt cookie
  const bytes = CryptoJS.AES.decrypt(login, process.env.COOKIE_KEY);
  const { id } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  db.query(command, [id], function (err, userData) {
    if (err) throw Error(`Error with database #logged-userData: ${err}`);

    const command = "SELECT commentID FROM likes where userID = ?";
    db.query(command, [id], function (err, userLikes) {
      if (err) throw Error(`Error with database #logged-userLikes: ${err}`);
      const likes = userLikes.map((e) => e["commentID"]);
      userData[0]["likes"] = likes;
      res.json(userData[0]);
    });
  });
});

// Donwload ALL users
app.get("/users-list", function (req, res) {
  const command = "SELECT nick, avatar FROM user";
  db.query(command, function (err, users) {
    if (err) throw Error(`Error with database #users-list: ${err}`);
    res.json(users);
  });
});

//like on unlike comment
app.post("/like", function (req, res) {
  const { userID, commentID } = req.body;
  const command = "SELECT * FROM likes where userID =? and commentID = ?";

  db.query(command, [userID, commentID], function (err, result) {
    if (err) throw Error(`Error with database #check "like" status: ${err}`);
    if (!result[0]) {
      const command = "INSERT INTO likes(userID,commentID) VALUES(?,?)";
      db.query(command, [userID, commentID], function (err, result) {
        if (err) throw Error(`Error with database #add-like 2: ${err}}`);
      });
    } else {
      const command = "DELETE FROM likes where id =?";
      db.query(command, [result[0]["id"]], function (err) {
        if (err) throw Error(`Error with database #remove-like${err}`);
      });
    }
  });

  res.sendStatus(200);
});

// Update profile info
app.post("/update-profile", upload.single("myFile"), async (req, res) => {
  const { nick, about, avatar, id } = JSON.parse(req.body["data"]);
  let columns = "";
  let imgSrc;
  const value = [about, nick, id];
  try {
    if (req.file) {
      imgSrc = `/users-pictures/${req.file.filename}`;
      columns = "avatar = ?,";
      value.splice(1, 0, `/users-pictures/${req.file.filename}`);

      if (avatar !== "/images/user.svg") {
        fs.unlink(`../app/public/${avatar}`, (err) => {
          if (err) throw err;
        });
      }
    }

    columns += "nick =?";
    const updateAccount = `UPDATE user set about = ?, ${columns} where id = ?`;
    db.query(updateAccount, value, (err) => {
      if (err) throw Error(`Error with database #update-profile: ${err}`);
      value.splice(0, 1);
      const commandTwo = `UPDATE comments set ${columns} where userID = ?`;
      db.query(commandTwo, value, (err) => {
        if (err)
          throw Error(`Erorr with database #update-profile-commets: ${err}`);
        res.json({ imgSrc: imgSrc }).status(200);
      });
    });
  } catch (err) {
    throw err;
  }
});

// folowers
app.post("/follow", (req, res) => {
  function deleteFollow(e) {
    const command = "DELETE FROM followers where id =?";
    db.query(command, [e], (err) => {
      if (err) throw Error(`$Error with database #delete follow: ${err}`);
      res.json({ value: false });
    });
  }
  function addFollow() {
    const command = "INSERT INTO followers values(null,?,?)";
    db.query(command, value, (err) => {
      if (err) throw Error(`Error with database #folow: ${err}`);
      res.json({ value: true });
    });
  }
  const { owner, person } = req.body;
  const value = [owner, person];
  const checkFolow =
    "SELECT id from followers where `ownerID` = ? and `personID` = ?";
  db.query(checkFolow, value, (err, result) => {
    if (err) throw Error(`Error with database #follow: ${err}`);
    if (result[0]) return deleteFollow(result[0]["id"]);
    addFollow();
  });
});

app.listen(PORT, () => {
  console.log(`The server has been activated: http://localhost:${PORT} `);
});
