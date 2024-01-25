module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comments", {
    CommentID: {
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
    Content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { onDelete: "cascade" });
    Comment.belongsTo(models.Tweet, { onDelete: "cascade" });
  };

  return Comment;
};
