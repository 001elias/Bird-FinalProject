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

async function searchUsers(loggedUserID, searchTerm) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const postQuery = `SELECT u.*, 
                           CASE WHEN f.FollowedUserID IS NOT NULL THEN TRUE ELSE FALSE END AS Following
                       FROM HareDb.Users u
                       LEFT JOIN HareDb.Followers f ON u.UserID = f.FollowedUserID AND f.FollowUserID = ${loggedUserID}
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

/* saves a tweet to the database */
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

/* returns the home page tweets : user + followed */
async function getHomeTweets(userID) {
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
/* returns the home page tweets : user + followed */
async function getUserTweets(userID) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT T.*, U.AvatarURL, U.Username  FROM HareDb.Tweets T                  
                     LEFT JOIN HareDb.Users U on T.UserID = U.UserID                    
                     WHERE U.UserID = ${userID} 
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

/* Follow a user */
async function followUser(followUserId, toFollowUserId) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Followers (FollowUserID, FollowedUserID) VALUES (${followUserId}, ${toFollowUserId})`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* Unfollow a user */
async function unfollowUser(followUserId, toFollowUserId) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `DELETE  FROM HareDb.Followers
                   WHERE FollowUserID = ${followUserId} AND FollowedUserID = ${toFollowUserId};`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

module.exports = {
  searchTweets,
  searchUsers,
  saveTweetToDatabase,
  getHomeTweets,
  getUserTweets,
  followUser,
  unfollowUser,
};
