const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
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

const {
  getHomeTweets,
  getUserTweets,
  searchTweets,
  searchUsers,
  getAllUsers,
  saveTweet,
  deleteTweet,
  followUser,
  unfollowUser,
  getUserProfile,
  saveProfile,
  getFollowers,
  getFollowing,
  blockUser,
  deleteUser,
} = require("./queries");
const { env } = require("process");

require("dotenv").config();

AWS.config.update({
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
  })
);

// CORS configuration
app.use(
  // cors({
  //   origin: process.env.CORS_ORIGIN, // Your frontend domain
  //   credentials: true,
  // })
  cors()
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

/* Login route */
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Handle error
      return next(err);
    }
    if (!user) {
      // Authentication failed,
      return res
        .status(500)
        .send({ error: "login failed. Wrong password or username" });
    }
    // Manually establish the session
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Successful authentication, redirect to the home page or dashboard
      return res.status(200).json({ message: "Login successful", user: user });
    });
  })(req, res, next);
});

/* testing auth */
app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Access granted to protected page");
  } else {
    res.send("Access denied");
  }
});

/* returns either the home page tweets : user + followed 
  OR returns all user's tweets
*/

app.get("/get-tweets/:userId?", async (req, res) => {
  try {
    if (!req.user) return res.status(500).send("Authentication required");

    let results;
    if (!req.params.userId) {
      results = await getHomeTweets(req.user.UserID);
    } else {
      results = await getUserTweets(req.params.userId);
    }
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return res.status(500).send("Error fetching tweets");
  }
});

/* search for tweets with a specifc string in the content*/
app.post("/search-tweets", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");

  const { searchTerm } = req.body;
  try {
    const results = await searchTweets(searchTerm);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching tweets:", error);
    return res.status(500).send("Error searching tweets");
  }
});

/* deletes a specific tweet*/
app.post("/delete-tweet/:tweetID", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");
  if (!req.user.isAdmin) return res.status(401).send("Unauthorized access");

  try {
    await deleteTweet(req.params.tweetID);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error("Error deleting tweet", error, req.params.tweetID);
    return res.status(500).send("Error deleting tweet");
  }
});

/* search for users with a specifc string in the content*/
app.post("/search-users", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");

  const { searchTerm } = req.body;
  try {
    const results = await searchUsers(req.user.UserID, searchTerm);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).send("Error searching users");
  }
});

/* get all users from the User table except admin*/
app.get("/all-users", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");
  if (!req.user.isAdmin) return res.status(401).send("Unauthorized access");

  try {
    const results = await getAllUsers();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(500).send("Error fetching all users");
  }
});

/* blocks a specific user*/
app.post("/block-user/:userID/:isBlocked", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");
  if (!req.user.isAdmin) return res.status(401).send("Unauthorized access");

  try {
    await blockUser(req.params.userID, req.params.isBlocked == "true");
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error("Error blocking user", error, req.params.userName);
    return res.status(500).send("Error blocking user");
  }
});

/* deletes a specific user*/
app.post("/delete-user/:userID", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");
  if (!req.user.isAdmin) return res.status(401).send("Unauthorized access");

  try {
    await deleteUser(req.params.userID);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error("Error deleting user", error, req.params.userID);
    return res.status(500).send("Error deleting user");
  }
});

/* Follow a user */
app.post("/follow/:followedUserId", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");

  try {
    await followUser(req.user.UserID, req.params.followedUserId);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error("Error following:", error);
    return res.status(500).send("Error following");
  }
});

/* un Follow a user */
app.post("/unfollow/:followedUserId", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");
  try {
    await unfollowUser(req.user.UserID, req.params.followedUserId);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error("Error following:", error);
    return res.status(500).send("Error following");
  }
});

/* uploads a file to Amazon S3 */
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");

  if (req.file) {
    res.json({
      message: "Successfully uploaded",
      imageUrl: req.file.location, // The URL of the uploaded file
    });
  } else {
    res.status(400).send("File upload failed.");
  }
});

/* saves a tweet to the database */
app.post("/post-tweet", async (req, res) => {
  if (!req.user) return res.status(500).send("Authentication required");

  // Extract text and imageUrl from request body
  const { tweet, imageUrl } = req.body;
  try {
    // Assuming you have a database function to save a tweet
    await saveTweet(req.user.UserID, tweet, imageUrl);
    res.status(201).send({ message: "Tweet posted successfully" });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).send({ error: "Error posting tweet" });
  }
});

/* get a complete user profile with stats + is the logged use following the user*/
app.get("/get-profile/:userName", async (req, res) => {
  try {
    if (!req.user) return res.status(500).send("Authentication required");

    const results = await getUserProfile(req.user.UserID, req.params.userName);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).send("Error fetching profile");
  }
});

/* Updates a user profile */
app.post("/save-profile", async (req, res) => {
  try {
    if (!req.user) return res.status(500).send("Authentication required");

    const { profileInfo, avatarUrl } = req.body;
    const results = await saveProfile(profileInfo, avatarUrl);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error saving profile:", error);
    return res.status(500).send("Error saving profile");
  }
});

/* fetches the list of a user's followers*/
app.get("/get-followers/:userName", async (req, res) => {
  try {
    if (!req.user) return res.status(500).send("Authentication required");

    const results = await getFollowers(req.user.UserID, req.params.userName);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).send("Error fetching followers");
  }
});

/* fetches the list of peopl a given user is following*/
app.get("/get-following/:userName", async (req, res) => {
  try {
    if (!req.user) return res.status(500).send("Authentication required");

    const results = await getFollowing(req.user.UserID, req.params.userName);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching following:", error);
    return res.status(500).send("Error fetching following");
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
  if (!req.user) return res.status(500).send("Authentication required");

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
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
