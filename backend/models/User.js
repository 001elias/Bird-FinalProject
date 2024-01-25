module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("Users", {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    Bio: {
      type: DataTypes.STRING(255),
    },
    AvatarURL: {
      type: DataTypes.STRING(255),
    },
    Privacy: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Role: {
      type: DataTypes.ENUM('Admin', 'User'),
      allowNull: false,
    },
  });

  return User;
};
