'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.allCode, { foreignKey: 'roleid', targetKey: 'key', as: 'poisitionData' })
      User.hasMany(models.services, { foreignKey: 'customerid', as: "customerData" })
    }
  }
  User.init({
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    roleid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};