const mysql = require("mysql");
const dbConfig = require("../config/dbConfig");

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

module.exports = {
  searchUsers,
  getAllUsers,
  blockUser,
  deleteUser,
};
