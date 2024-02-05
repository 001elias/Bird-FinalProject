const mysql = require("mysql");
const dbConfig = require("../config/dbConfig");

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

module.exports = {
  searchTweets,
  saveTweet,
  deleteTweet,
  getHomeTweets,
  getUserTweets,
};
