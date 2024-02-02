const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const dbConfig = require("./config/dbConfig");
//passport.js stuff
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
let loggedUserID;
require("dotenv").config();

AWS.config.update({
  //accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "harebucket",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a real secret key
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   httpOnly: true,
    //   secure: false, // Set to true if you're using https
    //   sameSite: "strict", // Or 'none' if dealing with different domains
    //},
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure local strategy for Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    const connection = mysql.createConnection(dbConfig);

    connection.query(
      "SELECT * FROM Users WHERE Username = ?",
      [username],
      (err, users) => {
        connection.end();

        if (err) {
          return done(err);
        }

        if (users.length === 0) {
          return done(null, false, { message: "Incorrect username." });
        }

        const user = users[0];

        bcrypt.compare(password, user.Password, (err, isMatch) => {
          console.log(password, user.Password);
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        });
      }
    );
  })
);
// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.UserID);
});

passport.deserializeUser((id, done) => {
  // Replace with your database access to find user by id
  const connection = mysql.createConnection(dbConfig);
  connection.query(
    "SELECT * FROM Users WHERE UserID = ?",
    [id],
    (err, users) => {
      connection.end();
      if (err) {
        return done(err);
      }
      done(null, users[0]);
    }
  );
});

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend domain
    credentials: true,
  })
);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Handle error
      return next(err);
    }
    if (!user) {
      // Authentication failed,
      //return res.redirect("/login");
      return res.status(500).send({ error: "login failed" });
    }
    // Manually establish the session
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Successful authentication, redirect to the home page or dashboard
      //return res.redirect("/home");
      return res.status(200).json({ message: "Login successful", user: user });
    });
  })(req, res, next);
});

app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Access granted to protected page");
  } else {
    res.send("Access denied");
  }
});

app.get("/get-tweets", async (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.status(500).send("Error connecting to the database");
    }

    const query = "SELECT * FROM Tweets"; // Assuming you have a table 'tweets'

    connection.query(query, (error, results) => {
      connection.end();

      if (error) {
        console.error("Error fetching tweets:", error);
        return res.status(500).send("Error fetching tweets");
      }

      res.status(200).json(results);
    });
  });
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({
      message: "Successfully uploaded",
      imageUrl: req.file.location, // The URL of the uploaded file
    });
  } else {
    res.status(400).send("File upload failed.");
  }
});

async function saveTweetToDatabase(userID, text, imageUrl) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Tweets (UserID, Content, imageURL) VALUES (?, ?, ?)";
    db.query(query, [userID, text, imageUrl], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

app.post("/post-tweet", async (req, res) => {
  const { tweet, imageUrl } = req.body;
  console.log("req user", req.user);
  // Extract text and imageUrl from request body
  try {
    // Assuming you have a database function to save a tweet
    await saveTweetToDatabase(req.user.UserID, tweet, imageUrl);
    res.status(201).send({ message: "Tweet posted successfully" });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).send({ error: "Error posting tweet" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // Redirect or perform other logic after successfully logging out
    res.redirect("/login");
  });
});

// Middleware to serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, "../client/build")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a route to test the database connection
app.get("/test-connection", (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Error connecting to the database");
    } else {
      console.log("Connected to the database");
      res.send("Connected to the database");
    }
  });
  connection.end();
});

// Route for user registration
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err);
      return res.status(500).send("Database connection failed");
    }
    const newUser = [username, email, hashedPassword];
    const query = "INSERT INTO Users (Username, Email,Password) VALUES (?,?,?)";

    connection.query(query, newUser, (error, results) => {
      connection.end(); // Close the connection whether or not the query was successful

      if (error) {
        console.error("Error registering new user:", error);
        return res.status(500).send("Error registering new user");
      }

      // If no error, send a success response
      res.status(201).send("User registered successfully");
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
