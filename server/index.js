import express from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";
import "dotenv/config";
import fs from "fs";
import https from "https";
import CryptoJS from "crypto-js";
import cookieParser from "cookie-parser";
import multer from "multer";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.ethereal.email",
  port: 465,
  secure: true,
  auth: {
    user: "earthwenus@gmail.com",
    pass: `rwij fvhe npay fpit`,
  },
});

// Dodaj middleware do obsługi żądań HTTPS
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const PORT = 443;
// const PORT = 80;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://localhost:5173",
      "https://resplendent-sable-c3ed12.netlify.app",
      "https://stack-998d6.web.app",
    ],
    credentials: true,
  })
);

const server = https.createServer(options, app);

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

// create comment
app.post("/create-comment", (req, res) => {
  const { ownerID, nick, avatar, content, reply } = req.body;
  const value = [
    ownerID,
    nick,
    avatar,
    content,
    new Date(),
    reply ? reply : null,
  ];
  const command =
    "INSERT INTO user_comments(`ownerID`, nick , avatar , content ,date ,reply) VALUES(?,?,?,?,?,?)";
  db.query(command, value, (err) => {
    if (err) throw Error(`Error with database #create-comment: ${err}`);
    const lastComment = "SELECT * FROM user_comments ORDER BY id DESC LIMIT 1";
    db.query(lastComment, (err, result) => {
      if (err) throw Error(`Error with database #last-comment: ${err}`);
      result[0].likes = 0;
      result[0].replies = 0;
      res.json(result[0]);
    });
  });
});

// load commetns
app.post("/user-comments", async (req, res) => {
  const { type, id, reply, page } = req.body;
  let condition;

  switch (type) {
    case "owner":
      condition = `ownerID = ${id}`;
      break;
    case "reply":
      condition = `reply = ${reply}`;
      break;
    case "likes":
      const findCom = "SELECT commentID FROM likes where `userID` = ?";
      const comments = await new Promise((resolve) => {
        db.query(findCom, [id], (err, result) => {
          if (err)
            throw Error(
              `Error with database #find id of liked comment: ${err}`
            );
          if (!result[0]) return resolve(0);

          const annArray = result.map((e) => e["commentID"]);
          resolve(annArray.join(","));
        });
      });
      condition = `id IN (${comments})`;
      break;
    case "owner-replies":
      condition = `ownerID = ${id} AND reply IS NOT NULL`;
      break;
    default:
      condition = "id";
      break;
  }

  const repliesNum =
    "(SELECT COUNT(id) FROM user_comments REPLY where reply.reply = user_comments.id) as replies";

  const likesNum =
    "(SELECT COUNT(ID) from likes where commentID = user_comments.id) as likes";

  const command = `SELECT *,${repliesNum},${likesNum} FROM user_comments where ${condition} ORDER BY id DESC LIMIT 8 OFFSET ${page}`;
  db.query(command, (err, result) => {
    if (err) throw Error(`Error with database #user-comments: ${err}`);
    const maxComments = `SELECT COUNT(ID) as 'limit' from user_comments where ${condition}`;
    db.query(maxComments, (err, limit) => {
      if (err) throw Error(`Error with datbase #com limit: ${err}`);
      limit[0].comments = result;
      res.json(limit[0]);
    });
  });
});

// Loads a single comment
app.post("/selected-comment", (req, res) => {
  const { id } = req.body;
  const command =
    "SELECT *,(SELECT COUNT(id) FROM user_comments REPLY where reply.reply = user_comments.id) as replies ,(SELECT COUNT(ID) FROM likes where commentID = user_comments.id) as likes FROM user_comments where id = ?";
  db.query(command, [id], (err, result) => {
    if (err) throw Error(`Error with database #single-comment: ${err}`);
    res.json(result);
  });
});

// remove comment
app.post("/remove-comment", (req, res) => {
  const { id } = req.body;
  const command = "DELETE FROM user_comments WHERE id = ?";
  db.query(command, [id], function (err) {
    if (err) throw Error(`Error with database #remove-comment${err}`);
    res.sendStatus(200);
  });
});

// Load User Profile date
app.get("/users:nick", function (req, res) {
  const { nick } = req.params;

  const command =
    "SELECT nick, about, avatar, id,(SELECT COUNT(ID) FROM followers where personID = user.id) as followers,(SELECT COUNT(ID) from followers where ownerID = user.id) as following from user where nick = ?";
  db.query(command, [nick], (err, result) => {
    if (err) throw Error(`Error with database #users userData: ${err}`);
    res.json(result);
  });
});

// Create an account

// Check if email is already in use
app.post("/account-availability", async (req, res) => {
  const { login } = req.body;
  const findUserCmd = "SELECT id from user where login = ?";
  try {
    const user = await new Promise((resolve) => {
      db.query(findUserCmd, [login], (err, userData) => {
        if (err)
          throw Error(`Error wtih database #account-availability: ${err}`);
        resolve(userData[0]);
      });
    });

    if (user)
      return res.status(400).json("Account with that email already exists!");
    res.json("Account message");
  } catch (err) {
    throw err;
  }
});

// send code to email
app.post("/send-confirm-code", async (req, res) => {
  try {
    if (!req.cookies["code"]) {
      let code = "";
      while (code.length < 6) {
        const num = Math.round(Math.random() * 9);
        code += num;
      }
      code = Number(code);
      res.cookie("code", JSON.stringify(code), {
        httpOnly: true,
        secure: true,
        sameSite: false,
        maxAge: 1000 * 60 * 3,
      });
      console.log(1233333);
      // await transporter.sendMail({
      //   from: '"Szczawik 👻" <earthwenus@gmail.com>',
      //   // zmianić to na "login"
      //   to: "szczawik.rozwoju@wp.pl",
      //   subject: "Hello ✔",
      //   text: "Exampler message",
      //   html: `<div style='background-color:red'><b>Hello world?</b><p>Pss...</p>
      //   <p>Code is below</p>
      //   <p>${code}</p></div>`,
      // });
    }
    res.sendStatus(200);
  } catch (err) {}
});

app.post("/confirm-code", (req, res) => {
  const { codeToCheck } = req.body;
  const { code } = req.cookies;
  if (codeToCheck === JSON.parse(code)) {
    return res.sendStatus(200);
  }
  res.sendStatus(400);
});

// Create account
app.post("/create-account", async (req, res) => {
  const addAccount = "INSERT INTO user values(?,?,?,?,?,?,?)";
  const { login, nick, password } = req.body;
  try {
    const newPassword = await encryption(password);
    const values = [
      null,
      login,
      newPassword,
      "",
      nick,
      new Date(),
      "/images/user.svg",
    ];
    await new Promise((resolve) => {
      db.query(addAccount, values, (err) => {
        if (err) throw Error(`Error with database #create-account: ${err}`);
        resolve();
      });
    });
    const loginToUserAccount = "SELECT id FROM user where login = ?";
    db.query(loginToUserAccount, [login], (err, result) => {
      if (err)
        throw Error(
          `Error with database #create-account donwload user data: ${err}`
        );
      res.clearCookie("code", {
        httpOnly: true,
        secure: true,
        sameSite: false,
        maxAge: 0,
      });
      setLoggedCookies(result[0]["id"], res);
      res.sendStatus(200);
    });
  } catch (err) {
    throw err;
  }
});

// password encryption
async function encryption(e) {
  return await bcrypt.hash(e, 10);
}

// remove account
app.post("/remove", function (req, res) {
  const command = "DELETE from user where id =?";
  const commandComments = "DELETE from user_comments where ownerID =?";
  const commandLikes = "DELETE from likes where userID = ?";
  const removeFollowers = "DELETE from followers where ownerID =?";
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
  db.query(removeFollowers, [id], function (err) {
    if (err)
      throw Error(`Error with database #remove-likes in remove : ${err}`);
  });
  res.sendStatus(200);
});

// Login to an account
app.post("/login", (req, res) => {
  const command = "select password,id from user where Login = ?";
  const { login, password } = req.body;
  try {
    db.query(command, [login], async (err, data) => {
      if (err) throw Error(`Error with database #login: ${err}`);
      if (!data[0]) return res.sendStatus(400);
      const passwordIsCorrect = await bcrypt.compare(
        password,
        data[0]["password"]
      );
      if (passwordIsCorrect) {
        setLoggedCookies(data[0]["id"], res);
        return res.sendStatus(200);
      }
      res.sendStatus(400);
    });
  } catch (err) {
    throw Error(`Error during password validation: ${err}`);
  }
});

function setLoggedCookies(id, res) {
  const encryptID = CryptoJS.AES.encrypt(
    JSON.stringify({ id: id }),
    process.env.COOKIE_KEY
  ).toString();

  res.cookie("logged", encryptID, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 60 * 24,
    sameSite: "none",
    secure: true,
  });
  console.log("cookies");
}
// Logout
app.post("/logout", function (req, res) {
  res.clearCookie("logged", { maxAge: 0 });
  res.sendStatus(200);
});

// Check login status
app.get("/logged", async (req, res) => {
  try {
    const { logged } = req.cookies;
    if (!logged) return res.sendStatus(400);
    // decrypt cookie
    const bytes = CryptoJS.AES.decrypt(logged, process.env.COOKIE_KEY);
    const { id } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // download user dates
    const userData = await new Promise((resolve) => {
      const command = "SELECT id,nick,about,avatar,date FROM user where id =?";
      db.query(command, [id], (err, result) => {
        if (err) throw Error(`Error with database #logged-userData: ${err}`);
        resolve(result[0]);
      });
    });

    // donwload user likes
    const likes = await new Promise((resolve) => {
      const command = "SELECT commentID FROM likes where userID = ?";
      db.query(command, [id], (err, result) => {
        if (err) throw Error(`Error with database #logged-userLikes: ${err}`);
        const array = result.map((e) => e["commentID"]);
        resolve(array);
      });
    });

    // load folowing
    const folowing = await new Promise((resolve) => {
      const command = "SELECT personID FROM followers where `ownerID` = ?;";
      db.query(command, [id], (err, result) => {
        if (err) throw Error(`Error with database #following: ${err}`);
        const array = result.map((e) => e["personID"]);
        resolve(array);
      });
    });

    userData["likes"] = likes;
    userData["following"] = folowing;
    res.json(userData);
  } catch (err) {
    throw err;
  }
});

// Donwload ALL users
app.get("/account-list", (req, res) => {
  const command = "SELECT nick, avatar FROM `user`";
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
      const commandTwo = `UPDATE user_comments set ${columns} where ownerID = ?`;
      db.query(commandTwo, value, (err) => {
        if (err)
          throw Error(`Erorr with database #update-profile-commets: ${err}`);
        console.log(imgSrc);
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

server.listen(PORT, () => {
  console.log(`The server has been activated: https://localhost:${PORT} `);
});

// app.listen(PORT, () => {
//   console.log(`The server has been activated: http://localhost:${PORT} `);
// });
