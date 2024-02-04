const mysql = require("mysql");
const dbConfig = require("./config/dbConfig");

/* search for tweets with a specifc string in the content*/
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
                       WHERE Username LIKE "%${searchTerm}%" AND u.isAdmin = 0`;

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
async function saveTweet(userID, text, imageUrl) {
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
    const query = `SELECT DISTINCT T.*, U.AvatarURL, U.Username  FROM HareDb.Tweets T                  
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
                   WHERE FollowUserID = ${followUserId} AND FollowedUserID = ${toFollowUserId}`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* get a complete user profile with stats + is the logged use following the user*/
async function getUserProfile(loggedUserID, userName) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT UserID, Username, Bio, AvatarURL, Fullname, Location, SocialURL,
                   (SELECT COUNT(*) FROM HareDb.Tweets T WHERE T.UserID = U.UserID) AS TweetCount,
                   (SELECT COUNT(*) FROM HareDb.Followers F1 WHERE F1.FollowedUserID = U.UserID) AS FollowerCount,
                   (SELECT COUNT(*) FROM HareDb.Followers F2 WHERE F2.FollowUserID = U.UserID) AS FollowsCount,                   
                   CASE WHEN f.FollowedUserID IS NOT NULL THEN TRUE ELSE FALSE END AS Following 
                   FROM HareDb.Users U
                   LEFT JOIN HareDb.Followers f ON U.UserID = f.FollowedUserID AND f.FollowUserID = ${loggedUserID}
                   WHERE Username = "${userName}"`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* Updates a user profile */
async function saveProfile(profileInfo, avatarURL) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `UPDATE HareDb.Users 
                   SET AvatarURL = "${avatarURL}",
                       Bio = "${profileInfo.Bio}",
                       Fullname = "${profileInfo.Fullname}",
                       Location = "${profileInfo.Location}",
                       SocialURL=  " ${profileInfo.SocialURL}"                    
                   WHERE UserID = ${profileInfo.UserID}`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* get the list of a user's followers*/
async function getFollowers(loggedUserID, userID) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT u.*,  CASE WHEN f2.FollowUserID IS NOT NULL THEN TRUE ELSE FALSE END AS Following             
                   FROM HareDb.Users u
                   LEFT JOIN HareDb.Followers f1 ON u.UserID = f1.FollowUserID 
                   LEFT JOIN HareDb.Followers f2 ON u.UserID = f2.FollowedUserID AND f2.FollowUserID = ${loggedUserID}
                   WHERE f1.FollowedUserID = ${userID}`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* get the list of other users a user is following*/
async function getFollowing(loggedUserID, userID) {
  const db = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT u.*,  CASE WHEN f2.FollowUserID IS NOT NULL THEN TRUE ELSE FALSE END AS Following             
                   FROM HareDb.Users u
                   LEFT JOIN HareDb.Followers f1 ON u.UserID = f1.FollowedUserID 
                   LEFT JOIN HareDb.Followers f2 ON u.UserID = f2.FollowedUserID AND f2.FollowUserID = ${loggedUserID}
                   WHERE f1.FollowUserID = ${userID}`;
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
  saveTweet,
  getHomeTweets,
  getUserTweets,
  followUser,
  unfollowUser,
  getUserProfile,
  saveProfile,
  getFollowers,
  getFollowing,
};
