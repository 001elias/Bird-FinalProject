const mysql = require("mysql");
const dbConfig = require("./config/dbConfig");

/* search for tweets with a specifc string in the content*/
async function searchTweets(searchTerm) {
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const postQuery = `SELECT T.*, U.AvatarURL, U.Username  FROM HareDb.Tweets T
      LEFT JOIN HareDb.Users U on T.UserID = U.UserId
      WHERE T.Content LIKE "%${searchTerm}%"
      ORDER BY T.TweetID DESC`;

    conn.query(postQuery, (err, result) => {
      conn.end();
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* search for users with a specifc string in the content*/
async function searchUsers(loggedUserID, searchTerm) {
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const postQuery = `SELECT u.*, 
                           CASE WHEN f.FollowedUserID IS NOT NULL THEN TRUE ELSE FALSE END AS Following
                       FROM HareDb.Users u
                       LEFT JOIN HareDb.Followers f ON u.UserID = f.FollowedUserID AND f.FollowUserID = ${loggedUserID}
                       WHERE Username LIKE "%${searchTerm}%" AND u.isAdmin = 0`;

    conn.query(postQuery, (err, result) => {
      conn.end();
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* search for users with a specifc string in the content*/
async function getAllUsers() {
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const postQuery =
      "SELECT * FROM HareDb.Users WHERE isAdmin =0 ORDER BY Username ASC";

    conn.query(postQuery, (err, result) => {
      conn.end();
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* block a user*/
async function blockUser(userID, isBlocked) {
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `UPDATE HareDb.Users 
                   SET isBlocked = ${isBlocked ? 1 : 0}
                   WHERE UserID = ${userID}`;

    conn.query(query, (err, result) => {
      conn.end();
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

/* delete a user + his tweets*/
async function deleteUser(userID) {
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query1 = `DELETE FROM HareDb.Users                    
                   WHERE UserID = ${userID}`;

    const query2 = `DELETE FROM HareDb.Tweets                    
                    WHERE UserID = ${userID}`;

    conn.query(query1, (err1, result) => {
      if (err1) {
        reject(err1);
        return;
      }

      conn.query(query2, (err2, result) => {
        conn.end();
        if (err2) {
          reject(err2);
          return;
        }

        resolve(result);
      });
    });
  });
}

/* saves a tweet to the database */
async function saveTweet(userID, text, imageUrl) {
  const conn = mysql.createConnection(dbConfig);

  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Tweets (UserID, Content, imageURL) VALUES (?, ?, ?)";

    conn.query(query, [userID, text, imageUrl], (err, result) => {
      conn.end();
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* delete a tweet by its ID*/
async function deleteTweet(tweetID) {
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM HareDb.Tweets                    
                   WHERE TweetID = ${tweetID}`;

    conn.query(query, (err, result) => {
      conn.end;
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
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT T.*, U.AvatarURL, U.Username  FROM HareDb.Tweets T                  
                     LEFT JOIN HareDb.Users U on T.UserID = U.UserID
                     LEFT JOIN HareDb.Followers F on F.FollowUserID = ${userID}
                     WHERE U.UserID = ${userID} OR U.UserID = F.FollowedUserID
                     ORDER BY T.TweetID DESC`;

    conn.query(query, (err, result) => {
      conn.end;
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/* returns all user's tweets*/
async function getUserTweets(userID) {
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT T.*, U.AvatarURL, U.Username  FROM HareDb.Tweets T                  
                     LEFT JOIN HareDb.Users U on T.UserID = U.UserID                    
                     WHERE U.UserID = ${userID} 
                     ORDER BY T.TweetID DESC`;

    conn.query(query, (err, result) => {
      conn.end();
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
  const conn = mysql.createConnection(dbConfig);

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Followers (FollowUserID, FollowedUserID) VALUES (${followUserId}, ${toFollowUserId})`;

    conn.query(query, (err, result) => {
      conn.end();
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
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `DELETE  FROM HareDb.Followers
                   WHERE FollowUserID = ${followUserId} AND FollowedUserID = ${toFollowUserId}`;

    conn.query(query, (err, result) => {
      conn.end();
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
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT UserID, Username, Bio, AvatarURL, Fullname, Location, SocialURL,
                   (SELECT COUNT(*) FROM HareDb.Tweets T WHERE T.UserID = U.UserID) AS TweetCount,
                   (SELECT COUNT(*) FROM HareDb.Followers F1 WHERE F1.FollowedUserID = U.UserID) AS FollowerCount,
                   (SELECT COUNT(*) FROM HareDb.Followers F2 WHERE F2.FollowUserID = U.UserID) AS FollowsCount,                   
                   CASE WHEN f.FollowedUserID IS NOT NULL THEN TRUE ELSE FALSE END AS Following 
                   FROM HareDb.Users U
                   LEFT JOIN HareDb.Followers f ON U.UserID = f.FollowedUserID AND f.FollowUserID = ${loggedUserID}
                   WHERE Username = "${userName}"`;

    conn.query(query, (err, result) => {
      conn.end();
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
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `UPDATE HareDb.Users 
                   SET AvatarURL = "${avatarURL}",
                       Bio = "${profileInfo.Bio}",
                       Fullname = "${profileInfo.Fullname}",
                       Location = "${profileInfo.Location}",
                       SocialURL=  " ${profileInfo.SocialURL}"                    
                   WHERE UserID = ${profileInfo.UserID}`;

    conn.query(query, (err, result) => {
      conn.end();
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
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT u.*,  CASE WHEN f2.FollowUserID IS NOT NULL THEN TRUE ELSE FALSE END AS Following             
                   FROM HareDb.Users u
                   LEFT JOIN HareDb.Followers f1 ON u.UserID = f1.FollowUserID 
                   LEFT JOIN HareDb.Followers f2 ON u.UserID = f2.FollowedUserID AND f2.FollowUserID = ${loggedUserID}
                   WHERE f1.FollowedUserID = ${userID}`;

    conn.query(query, (err, result) => {
      conn.end();
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
  const conn = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    const query = `SELECT u.*,  CASE WHEN f2.FollowUserID IS NOT NULL THEN TRUE ELSE FALSE END AS Following             
                   FROM HareDb.Users u
                   LEFT JOIN HareDb.Followers f1 ON u.UserID = f1.FollowedUserID 
                   LEFT JOIN HareDb.Followers f2 ON u.UserID = f2.FollowedUserID AND f2.FollowUserID = ${loggedUserID}
                   WHERE f1.FollowUserID = ${userID}`;

    conn.query(query, (err, result) => {
      conn.end();
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
  getAllUsers,
  saveTweet,
  deleteTweet,
  getHomeTweets,
  getUserTweets,
  followUser,
  unfollowUser,
  getUserProfile,
  saveProfile,
  getFollowers,
  getFollowing,
  blockUser,
  deleteUser,
};
