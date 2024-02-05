const mysql = require("mysql");
const dbConfig = require("../config/dbConfig");

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

module.exports = {
  getUserProfile,
  saveProfile,
};
