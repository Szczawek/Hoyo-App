import express, { json } from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const PORT = 80;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "S#2_x.f{s_[9x",
  database: "magazine",
});

app.get("/", (req, res) => {
  res.send("Szczawik");
});

// Load comments
app.get("/comments", function (req, res) {
  const command =
    "SELECT user.nick, user.avatar,comments.*,(SELECT COUNT(commentID) FROM likes WHERE commentID = comments.id) AS likes from user JOIN comments ON user.id = comments.userID";
  db.query(command, function (err, data) {
    if (err) throw Error(`Error with database #comment: ${err}`);
    res.send(data);
  });
});

// Add comment to account
app.post("/add-comment", function (req, res) {
  const id = req.cookies["logged"];
  if (!id) {
    res.sendStatus(400);
    return;
  }
  const command =
    "INSERT INTO comments(userID,content, date,avatar,nick) values(?,?,?,?,?)";
  const values = [
    JSON.parse(id)["id"],
    req.body["content"],
    new Date(),
    req.body["avatar"],
    req.body["nick"],
  ];
  db.query(command, values, function (err, data) {
    if (err) throw Error(`Error with database #add-comment${err}`);
    res.sendStatus(200);
  });
});

// remove comment
app.post("/remove-comment", function (req, res) {
  const command = "DELETE FROM comments WHERE id = ?";
  db.query(command, [req.body["id"]], function (err, data) {
    if (err) throw Error(`Error with database #remove-comment${err}`);
  });
  res.sendStatus(200);
});

// Create an account
app.post("/create-account", function (req, res) {
  const command = "select id from user where login = ?";
  const login = req.body["login"];
  const nick = req.body["nick"];
  const avatar = "images/user.svg";
  db.query(command, [login], function (err, data) {
    if (err) throw Error(`Error with database: ${err}`);

    const accountExists = data[0];
    const command =
      "insert into user(Login,Password,Nick,Avatar,About) values(?,?,?,?,?)";

    if (!accountExists) {
      encryption()
        .then((password) => {
          db.query(
            command,
            [login, password, nick, avatar, ""],
            (err, data) => {
              if (err)
                throw Error(`Error with database #create-account: ${err}`);
            }
          );
          res.sendStatus(200);
        })
        .catch((err) => {
          throw Error(`Error during email validation: ${err}`);
        });
      return;
    }
    res.sendStatus(400);
  });

  async function encryption() {
    const result = await bcrypt.hash(req.body["password"], 10);
    return result;
  }
});

// remove account
app.post("/remove", function (req, res) {
  const command = "DELETE from user where id =?";
  const user = JSON.parse(req.cookies["logged"])["id"];
  res.clearCookie("logged", { httpOnly: true });
  db.query(command, [user], function (err, data) {
    if (err) throw Error(`Error with database #remove: ${err}`);
    const command = "DELETE from comments where userID =?";
    db.query(command, [user], function (err, data) {
      if (err)
        throw Error(`Error with database #remove-comments in remove : ${err}`);
    });
  });
  res.sendStatus(200);
});
// Login An Account
// DO ZMIANY
// DO ZMIANY
// DO ZMIANY
// DO ZMIANY
// DO ZMIANY
// DO ZMIANY
// DO ZMIANY
// DODAĆ DO LOGGED FUNCKJE POBIERANIA DANYCH
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
          const command = "SELECT * from likes where userID = ?";
          db.query(command, [data[0]["id"]], function (err, result) {
            if (err)
              throw Error(`Error with database #login-download-likes: ${err}}`);
            // copy.likedComments = result;
            delete copy.password;
            res.cookie("logged", `${JSON.stringify(copy)}`, { httpOnly: true });
            res.sendStatus(200);
          });
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
  res.clearCookie("logged", { httpOnly: true });
  res.sendStatus(200);
});

// DONE
// Check login status
app.get("/logged", function (req, res) {
  const login = req.cookies["logged"];
  if (!login) return res.sendStatus(400);
  const command = "SELECT id,nick,about,avatar FROM user where id =?";
  const value = [JSON.parse(login)["id"]];
  db.query(command, [value], function (err, userData) {
    if (err) throw Error(`Error with database #logged-userData: ${err}`);

    const command = "SELECT commentID FROM likes where userID = ?";
    db.query(command, [userData[0]["id"]], function (err, userLikes) {
      if (err) throw Error(`Error with database #logged-userLikes: ${err}`);
      const id = userLikes.map((e) => e["commentID"]);
      userData[0]["likes"] = id;
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
    const command =
      "SELECT *,(SELECT COUNT(*) FROM likes where commentID = comments.id) as likes from comments where userID = ?";
    db.query(command, [obj["id"]], function (err, commentsData) {
      if (err) throw Error(`Error with database comments: ${err}`);
      obj.comments = commentsData.reverse();
      res.json(obj);
    });
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

app.listen(PORT, () => {
  console.log(`The server has been activated: http://localhost:${PORT} `);
});
