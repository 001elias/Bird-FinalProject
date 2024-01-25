module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define("Tweets", {
    TweetID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ImageURL: {
      type: DataTypes.STRING(255),
    },
    RetweetID: {
      type: DataTypes.INTEGER,
    }
  });

  Tweet.associate = (models) => {
    Tweet.belongsTo(models.Users);
    Tweet.belongsTo(Tweet, { as: 'Retweet', foreignKey: 'RetweetID',});
  };
  
  return Tweet;
};
