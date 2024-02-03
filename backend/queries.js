const mysql = require("mysql");
const dbConfig = require("./config/dbConfig");

async function searchTweets(searchTerm) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const postQuery = `SELECT T.*, U.AvatarURL, U.Username  FROM HareDb.Tweets T
      LEFT JOIN HareDb.Users U on T.UserID = U.UserId
      WHERE T.Content LIKE "%${searchTerm}%"
      ORDER BY T.TweetID DESC`;
    db.query(postQuery, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

async function searchUsers(searchTerm) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const postQuery = `SELECT *  
                       FROM HareDb.Users
                       WHERE Username LIKE "%${searchTerm}%"`;

    db.query(postQuery, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

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

async function getTweets(userID) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT T.*, U.AvatarURL, U.Username  FROM HareDb.Tweets T                  
                     LEFT JOIN HareDb.Users U on T.UserID = U.UserID
                     LEFT JOIN HareDb.Followers F on F.FollowUserID = ${userID}
                     WHERE U.UserID = ${userID} OR U.UserID = F.FollowedUserID
                     ORDER BY T.TweetID DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

module.exports = { searchTweets, searchUsers, saveTweetToDatabase, getTweets };
