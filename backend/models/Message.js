module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Messages", {
    FromUserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    ToUserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    Content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ImageURL: {
      type: DataTypes.STRING(255),
    },
  });

  Message.associate = (models) => {Message.belongsTo(models.Users, {
      foreignKey: 'FromUserID',
      as: 'FromUser',
    })};

  Message.belongsTo(models.Users, {
    foreignKey: 'ToUserID',
    as: 'ToUser',
  });

  return Message;
};
