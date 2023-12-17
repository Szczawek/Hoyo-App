import express from "express";
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
    "SELECT user.nick, user.avatar,comments.* from user JOIN comments ON user.id = comments.userID";
  db.query(command, function (err, data) {
    if (err) throw Error(`Error with database #comment: ${err}`);
    res.send(data);
  });
});

// TO FIX
// app.post("/users/:userName", function (req, res) {
//   console.log(req.params)
//   res.sendStatus(200)

// });

// Add comment to account
app.post("/add-comment", function (req, res) {
  if (!req.cookies["logged"]) {
    res.sendStatus(400);
    return;
  }
  const command =
    "INSERT INTO comments(userID,content, date,likes) values(?,?,?,?)";
  const userID = JSON.parse(req.cookies["logged"])["id"];
  const content = req.body["content"];
  const values = [userID, content, new Date(), 0];
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
      "insert into user(Login,Password,Nick,Avatar) values(?,?,?,?)";

    if (!accountExists) {
      encryption()
        .then((password) => {
          db.query(command, [login, password, nick, avatar], (err, data) => {
            if (err) throw Error(`Error with database #create-account: ${err}`);
          });
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
app.post("/login", function (req, res) {
  const command = "select nick,password,id,avatar from user where Login = ?";
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
          res.cookie("logged", `${JSON.stringify(copy)}`, { httpOnly: true });
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
  res.clearCookie("logged", { httpOnly: true });
  res.sendStatus(200);
});

app.get("/logged", function (req, res) {
  const login = req.cookies["logged"];
  if (login) {
    res.json(login);
    return;
  }
  res.sendStatus(400);
});

// Users account
app.get("/users", function (req, res) {
  const command = "SELECT nick,about,avatar from user";
  db.query(command, function (err, result) {
    if (err) throw Error(`Error with database #users: ${err}`);
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`The server has been activated: http://localhost:${PORT} `);
});
