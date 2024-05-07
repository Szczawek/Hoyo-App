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
import jwt from "jsonwebtoken";
import { fireApp } from "./fireConfig.js";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import rateLimit from "express-rate-limit";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.ethereal.email",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_LOGIN,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Dodaj middleware do obsługi żądań HTTPS
const options = {
  key: process.env.KEY_KEY,
  cert: process.env.CERT_KEY,
};

// All expensive endpoint
const pathToSkip = ["/create-comment", "/confirm-code", "/update-profile"];

const limit = rateLimit({
  windowMs: 1000 * 60 * 15,
  max: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => !pathToSkip.includes(req.url),
});

const PORT = 443;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://stack-998d6.web.app",
      "https://stack-998d6.firebaseapp.com",
      "https://localhost:5173",
      "https://resplendent-sable-c3ed12.netlify.app",
    ],
    credentials: true,
  })
);
app.use(limit);

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
  // /users-pictures
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    cb(null, fileName);
  },
});

// picture size limit
const upload = multer({
  // storage: storage,
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 1024 * 1024 * 10,
  },
});

app.get("/", (req, res) => {
  res.send("Szczawik");
});

// create comment
app.post("/create-comment", (req, res) => {
  const { ownerID, nick, avatar, content, reply, hashName } = req.body;
  const value = [
    ownerID,
    nick,
    avatar,
    content,
    hashName,
    new Date(),
    reply ? reply : null,
  ];
  const command =
    "INSERT INTO user_comments(`ownerID`, nick , avatar , content,hashName ,date ,reply) VALUES(?,?,?,?,?,?,?)";
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
app.get("/users:hashName", function (req, res) {
  const { hashName } = req.params;
  const command =
    "SELECT nick, about, avatar,baner,hashName, id,(SELECT COUNT(ID) FROM followers where personID = user.id) as followers,(SELECT COUNT(ID) from followers where ownerID = user.id) as following from user where hashName = ?";
  db.query(command, [hashName], (err, result) => {
    if (err) throw Error(`Error with database #users userData: ${err}`);
    res.json(result);
  });
});

// Check if email is already in use
app.post("/account-availability", async (req, res) => {
  const { login, password, nick, name } = req.body;
  const findUserCmd = "SELECT id from user where login = ? OR nick = ?";
  try {
    const user = await new Promise((resolve) => {
      db.query(findUserCmd, [login, nick], (err, userData) => {
        if (err)
          throw Error(`Error wtih database #account-availability: ${err}`);
        resolve(userData[0]);
      });
    });

    if (user)
      return res.status(400).json("Account with that email already exists!");
    res.cookie(
      "createAccountData",
      JSON.stringify({ login, password, nick, name }),
      {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60,
      }
    );
    await sendConfrimCode(res, login);
    res.json("Account message");
  } catch (err) {
    throw err;
  }
});
async function sendConfrimCode(res, login) {
  try {
    const arrayWithCode = [];
    for (let i = 0; i < 6; i++) {
      arrayWithCode.push(Math.round(Math.random() * 9));
    }
    const code = arrayWithCode.join("");
    const encryptCode = await encryption(code, 5);
    console.log({ Code: code });
    await res.cookie(
      "confirmCode",
      JSON.stringify({ code: encryptCode, timer: new Date() }),
      {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 3,
      }
    );

    // SEND EMAIL TO USER ACCOUNT
    await transporter.sendMail({
      from: '"Hoyo Earth" <earthwenus@gmail.com>',
      to: login,
      subject: "Confirm code",
      text: "Code:",
      html: `<div style='background-color:red,padding:1rem,font-size:1.5rem,display:grid,place-content:center'><h1>Hello world?</h1><p>Pss...</p>
      <p>Code is below</p>
      <code>${code}</code></div>`,
    });
  } catch (err) {
    throw err;
  }
}

app.post("/refresh", (req, res) => {
  const { createAccountData } = req.cookies;
  if (!createAccountData) return res.sendStatus(400);
  const { login } = JSON.parse(createAccountData);
  sendConfrimCode(res, login);
  res.sendStatus(200);
});

// DOWNLOAD MAXAGE CONFRIMCODE COOKIE
app.get("/code-timer", (req, res) => {
  const cookies = req.cookies["confirmCode"];
  if (!cookies) return res.sendStatus(400);
  const { timer } = JSON.parse(cookies);
  const ms = Math.abs(new Date() - new Date(timer));
  const gapInMinutes = Math.floor(ms / 60000);
  const gapInSeconds = Math.floor((ms % 60000) / 1000);
  const seconds = 59 - gapInSeconds;
  const minutes = 2 - gapInMinutes;
  if (minutes < 0) return res.json({ seconds: 0, minutes: 0 });
  res.json({ seconds, minutes });
});

// COMPARE USER INPUTS CODE WITH ORIGIN
app.post("/confirm-code", async (req, res) => {
  const { codeToCheck } = req.body;
  const { createAccountData, confirmCode } = req.cookies;
  const createAccountDataObj = JSON.parse(createAccountData);
  const { code } = JSON.parse(confirmCode);
  const decodeCode = await bcrypt.compare(String(codeToCheck), code);
  if (decodeCode) {
    await createAccount(req, res, createAccountDataObj);
    return res.json({ nick: createAccountDataObj["hashName"] });
  }
  res.status(400).json(":/");
});

// Create account FN
async function createAccount(req, res, userData) {
  const { login, password, nick, name } = userData;
  const addAccount =
    "INSERT INTO user(login,nick,password,about,date,avatar,hashName,baner) values(?,?,?,?,?,?,?,?)";
  try {
    const newPassword = await encryption(password, 10);
    const values = [
      login,
      nick,
      newPassword,
      "",
      new Date(),
      "/images/user.svg",
      name,
      "/images/baner.png",
    ];
    await new Promise((resolve) => {
      db.query(addAccount, values, (err) => {
        if (err) throw Error(`Error with database #create-account: ${err}`);
        resolve();
      });
    });
    const loginToUserAccount = "SELECT id FROM user where login = ?";
    await new Promise((resolve) => {
      db.query(loginToUserAccount, [login], (err, result) => {
        if (err)
          throw Error(
            `Error with database #create-account donwload user data: ${err}`
          );
        res.clearCookie("confirmCode", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.clearCookie("createAccountData", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        setLoggedCookies(result[0]["id"], res);
        resolve();
      });
    });
  } catch (err) {
    throw Error(`Error with #create-account FN: ${err}`);
  }
}

// password encryption
async function encryption(e, salt) {
  return await bcrypt.hash(e, salt);
}

// Delete Profile
app.delete("/delete-account", function (req, res) {
  const command = "DELETE from user where id =?";
  const commandComments = "DELETE from user_comments where ownerID =?";
  const commandLikes = "DELETE from likes where userID = ?";
  const removeFollowers = "DELETE from followers where ownerID =?";
  const { logged } = req.cookies;
  const firstBarrier = jwt.verify(logged, process.env.ACCOUNT_ACCESS_KEY);
  const bytes = CryptoJS.AES.decrypt(firstBarrier, process.env.COOKIE_KEY);
  const id = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

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
    JSON.stringify(id),
    process.env.COOKIE_KEY
  ).toString();
  const token = jwt.sign(encryptID, process.env.ACCOUNT_ACCESS_KEY);
  res.cookie("logged", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "none",
    secure: true,
  });
}
// Logout
app.post("/logout", function (req, res) {
  res.clearCookie("logged", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.sendStatus(200);
});

// Check login status
app.get("/logged", async (req, res) => {
  try {
    const { logged } = req.cookies;
    if (!logged) return res.sendStatus(400);
    // decrypt cookie
    const firstBarrier = jwt.verify(logged, process.env.ACCOUNT_ACCESS_KEY);
    const bytes = CryptoJS.AES.decrypt(firstBarrier, process.env.COOKIE_KEY);
    const id = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // download user dates
    const userData = await new Promise((resolve) => {
      const command =
        "SELECT id,nick,about,avatar,date,baner,hashName FROM user where id =?";
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
// In the feature there will be an error with "LIMIT 100" and I will forget about it :D
app.get("/account-list", (req, res) => {
  const command = "SELECT nick, avatar,hashName FROM `user` LIMIT 100";
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
const donwloadFileFN = upload.fields([
  { name: "avatar", maxCount: 1, optionals: true },
  { name: "baner", maxCount: 1, optionals: true },
]);

app.put("/update-profile", donwloadFileFN, async (req, res) => {
  try {
    const { avatar, baner } = req.files;
    const { nick, about, id, prevAvatar, prevBaner } = JSON.parse(
      req.body["data"]
    );

    const value = [about, nick];
    const newFile = [avatar, baner];
    const prevImage = [prevAvatar, prevBaner];
    delete req.files;
    for (let i = 0; i < 2; i++) {
      await manageFiles(prevImage[i], i);
    }
    async function manageFiles(e, index) {
      try {
        if (!newFile[index]) return value.push(e);
        const metadata = {
          contentType: newFile[index][0]["mimetype"],
        };
        const storage = getStorage(fireApp);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
        const imgLocation = ref(storage, `users_pictures/${fileName}`);
        const imgToBlob = new Blob([newFile[index][0]["buffer"]], metadata);
        await uploadBytes(imgLocation, imgToBlob, metadata);
        const linkToImg = await getDownloadURL(imgLocation);
        value.push(linkToImg);
        if (e === "/images/baner.png" || e === "/images/user.svg") return;
        const imgToDelete = ref(storage, e);
        const statusDeletingImg = await deleteObject(imgToDelete);
        console.log(statusDeletingImg);
      } catch (err) {
        throw err;
      }
    }

    //   // value.push(`/users-pictures/${newFile[index][0]["filename"]}`);
    //   // if (e === "/images/baner.png" || e === "/images/user.svg") return;
    //   // fs.unlink(`../app/public/${e}`, (err) => {
    //   //   if (err) throw Error(err);
    //   // });
    // });

    const updateAccount = `UPDATE user set about =?, nick =?, avatar =?, baner =? where id = ?`;
    db.query(updateAccount, [...value, id], (err) => {
      if (err) throw Error(`Error with database #update-profile: ${err}`);
      const commandTwo = `UPDATE user_comments set nick=?,avatar =? where ownerID = ?`;
      db.query(commandTwo, [nick, value.slice(2, 3), id], (err) => {
        if (err)
          throw Error(`Erorr with database #update-profile-commets: ${err}`);
        res.json({ avatar: value[2], baner: value[3] });
      });
    });
  } catch (err) {
    throw err;
  }
});
// add/remove follow
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
