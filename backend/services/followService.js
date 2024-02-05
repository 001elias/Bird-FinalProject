const mysql = require("mysql");
const dbConfig = require("../config/dbConfig");

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
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
