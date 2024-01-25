module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("Likes", {
    LikeID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TweetID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, { onDelete: "cascade" });
    Like.belongsTo(models.Tweet, { onDelete: "cascade" });
  };

  return Like;
};
