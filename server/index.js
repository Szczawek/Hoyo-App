import express from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";
import "dotenv/config";
import Jimp from "jimp";
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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DATABASE_PASSWORD,
  database: "magazine",
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 10,
  },
});

const fullData = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
);
app.get("/", (req, res) => {
  res.send("Szczawik");
});

// Load comments
app.get("/comments:id", function (req, res) {
  const id = JSON.parse(req.params["id"]);
  const optionOne =
    "SELECT comments.*, (SELECT COUNT(`commentID`) FROM likes where `commentID` = comments.id) as likes FROM comments";
  const optionTwo =
    "SELECT comments.*, (SELECT COUNT(`commentID`) FROM likes where `commentID` = comments.id) as likes FROM comments where userID =?";
  const command = id === 0 ? optionOne : id > 0 ? optionTwo : null;
  db.query(command, [id], function (err, data) {
    if (err) throw Error(`Error with database #comment: ${err}`);
    res.json(data);
  });
});

// remove comment
app.post("/remove-comment", function (req, res) {
  const command = "DELETE FROM comments WHERE id = ?";
  db.query(command, [req.body["id"]], function (err, data) {
    if (err) throw Error(`Error with database #remove-comment${err}`);
    res.sendStatus(200);
  });
});

// Add comment to account
app.post("/add-comment", upload.single("myFile"), function (req, res) {
  const data = req.cookies["logged"];
  if (!data) return res.sendStatus(400);

  // decrypt cookie
  const bytes = CryptoJS.AES.decrypt(data, process.env.COOKIE_KEY);
  const { id } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const { content, nick } = JSON.parse(req.body["data"]);
  const command =
    "INSERT INTO comments(userID, content, date, avatar, nick) values(?,?,?,?,?)";
  const values = [id, content, fullData, req.file.buffer, nick];
  db.query(command, values, function (err, data) {
    if (err) throw Error(`Error with database #add-comment${err}`);
    res.sendStatus(200);
  });
});

// Create an account
app.post("/create-account", function (req, res) {
  const command = "select id from user where login = ?";
  const login = req.body["login"];
  const nick = req.body["nick"];
  db.query(command, [login], function (err, data) {
    if (err) throw Error(`Error with database: ${err}`);

    const accountExists = data[0];

    if (!accountExists) {
      encryption(req.body["password"])
        .then((password) => {
          const command =
            "INSERT INTO `user` (`Login`, `Password`, `nick`, `About`, `date`) values(?,?,?,?,?)";

          const value = [login, password, nick, "", fullData];

          db.query(command, value, (err, data) => {
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
  db.query(command, [id], function (err, data) {
    if (err) throw Error(`Error with database #remove: ${err}`);
  });
  db.query(commandComments, [id], function (err, data) {
    if (err)
      throw Error(`Error with database #remove-comments in remove : ${err}`);
  });
  db.query(commandLikes, [id], function (err, result) {
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
  const command = "SELECT nick,avatar FROM user";
  db.query(command, function (err, users) {
    if (err) throw Error(`Error with database #users-list: ${err}`);
    res.json(users);
  });
});

// DONE
// Download USER dates
app.get("/users:nick", function (req, res) {
  const command = "SELECT nick, about, avatar, id from user";
  db.query(command, function (err, userData) {
    if (err) throw Error(`Error with database #users userData: ${err}`);
    const obj = userData.find(
      (e) => e["nick"].toLowerCase() === req.params["nick"].toLowerCase()
    );
    if (!obj) return res.sendStatus(405);
    res.send(obj);
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
      db.query(command, [result[0]["id"]], function (err, result) {
        if (err) throw Error(`Error with database #remove-like${err}`);
      });
    }
  });

  res.sendStatus(200);
});

// Update profile info
app.post("/update-profile", upload.single("myFile"), async (req, res) => {
  try {
    const file = req.file.buffer;
    const jimpImage = await Jimp.read(file);
    jimpImage.resize(300, 200);
    const editImg = await jimpImage.getBufferAsync(Jimp.MIME_JPEG);
    const { nick, about, id } = JSON.parse(req.body["data"]);

    const command =
      "UPDATE user set nick = ?, about = ?, avatar = ? where id = ?";
    const value = [nick, about, editImg, id];
    db.query(command, value, (err) => {
      if (err) throw Error(`Error with database #update-profile: ${err}`);
      const commandTwo =
        "UPDATE comments set nick = ?, avatar =? where userID = ?";
      db.query(commandTwo, [nick, editImg, id], (err) => {
        if (err)
          throw Error(`Erorr with database #update-profile-commets: ${err}`);
        res.sendStatus(200);
      });
    });
  } catch (err) {
    throw err;
  }
});

app.listen(PORT, () => {
  console.log(`The server has been activated: http://localhost:${PORT} `);
});
