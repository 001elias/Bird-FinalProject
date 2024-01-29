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
require("dotenv").config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a real secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if you're using https
      sameSite: "strict", // Or 'none' if dealing with different domains
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend domain
    credentials: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Configure local strategy for Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // Change to username
    },
    (username, password, done) => {
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
    }
  )
);
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Replace with your database access
  const connection = mysql.createConnection(dbConfig);
  connection.query(
    "SELECT * FROM Users WHERE Username = ?",
    [username],
    (err, users) => {
      connection.end();
      if (err || users.length === 0) {
        return res.status(401).send("Invalid credentials");
      }

      const user = users[0];
      bcrypt.compare(password, user.Password, (err, result) => {
        if (err || !result) {
          return res.status(401).send("Invalid credentials");
        }
        // If credentials are valid
        res.status(200).send({ message: "Login successful", user });
      });
    }
  );
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // If authentication failed, redirect to /login with an error message
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // If authentication is successful, redirect to /home
      return res.redirect("/home");
    });
  })(req, res, next);
});

// Check if user is logged in
app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ isAuthenticated: true, user: req.user });
  }
  res.status(401).json({ isAuthenticated: false });
});

async function checkAuth() {
  const token = process.env.SESSION_SECRET;
  const response = await fetch("http://localhost:3000/check-auth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
checkAuth();

fetch("http://localhost:3000/check-auth", {
  method: "GET",
  credentials: "include", // Important for sending cookies
});

// Logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

fetch("http://localhost:3000/home", {
  method: "GET", // or POST, PUT, etc.
  credentials: "include", // This is important for sending and receiving cookies
  // ... other settings
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
