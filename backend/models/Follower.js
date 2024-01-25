module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define("Followers", {
    FollowUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    FollowedUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  });

  Follower.associate = (models) => {
    Follower.belongsTo(models.User, { foreignKey: 'FollowUserID',as: 'Follower',
    });

    Follower.belongsTo(models.User, { foreignKey: 'FollowedUserID',as: 'FollowedUser',
    });
  };

  return Follower;
};
